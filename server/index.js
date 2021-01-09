//Sergio Casanova Hernández - 48675607V

var express = require('express');
var app = express();
var bp = require('body-parser');
app.use(bp.json())
var jwt =require('jwt-simple');
var multer = require('multer');
const knex = require('knex')({
   client: 'sqlite3',
   connection: {
     filename: "./p1.db"
   },
   useNullAsDefault: true
});
var cors = require('cors')
app.use(cors())
secret = "ADI"

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now())
  }
});

var upload = multer({storage: storage});


app.post('/fileUpload', upload.single('image'), function(req, resp) {
  try{
    var body = req.body;
        insertDocuments(body.ID, './uploads' + req.file.filename,
        function(){
          resp.status(204).end()
        },
        function() {
          resp.status(404);
          resp.send({mensaje:"No se ha encontrado el usuario"})
        })
  }catch{
    resp.status(500)
    resp.send({mensaje:"No se ha podido conectar a la base de datos"})
  }
})

function insertDocuments (id,filePath, success_callback,error_callback) {
  knex('USUARIOS').update({imagen:filePath}).where({ID:id})
     .asCallback(function(error,result){
         if (result == 1)
           success_callback()
         else
           error_callback()     
     })
}


function login(email,pass,success_select,error_callback) {
  knex("USUARIOS").where({EMAIL:email, PASSWORD:pass})
    .asCallback(function(error, user){
        if (user.length != 0){
          success_select(user);
        }else
          error_callback();        
    })
}

app.post('/login', async function(pet, resp){
  var body = pet.body

  try{
      login(body.EMAIL,body.PASSWORD,
        function(user){
          var email = user[0].EMAIL;
          var nombre = user[0].NOMBRE;
          var token=jwt.encode({body:body.login},secret);
          resp.status(200);
          resp.send({
            EMAIL: email,
            NOMBRE: nombre,
            token: token})
          },

        function(){
        resp.status(401)
        resp.send({mensaje:"Login incorrecto"}).end()
        })
  }catch{
    resp.status(500)
    resp.send({mensaje:"No se ha podido conectar a la base de datos"})
  }
})

function chequeaJWT(pet, resp, next) {
  var tokenOK  = false
  var cabecera = pet.header('Authorization')
  var campos = cabecera.split(' ')
  if (campos.length>1 && cabecera.startsWith('Bearer')) {
      var token = campos[1]
      try{
        var decoded = jwt.decode(token, secret);
        if (decoded) {
          tokenOK = true 
        }
      }catch{
        resp.status(403)
        resp.send({mensaje: "No tienes permisos"})
      }
  }
  if (tokenOK) {
      next()
  }
  else {

      resp.status(403)
      resp.send({mensaje: "No tienes permisos"})
  }
}


function buscarUsuario(id_user,success_select,error_callback) {
   knex.select("*")
     .from('USUARIOS')
     .where({ID:id_user})
     .asCallback(function(error, user){
         if (user.length > 0){
           success_select(user);
         }else
           error_callback();        
     })
 }

 app.get('/usuario', function(pet, resp) {
   var body = pet.body
   try{
    buscarUsuario(body.ID,
        function(user){
          resp.status(200);
          resp.send(user);
        },
        function(){
        resp.status(404)
        resp.send({mensaje:"Usuario no encontrado"})
        }) 
    }catch{
      resp.status(500)
      resp.send({mensaje:"No se ha podido conectar a la base de datos"})
    }  
 })
 
 async function listarUsuarios(offset,limit,success_select,error_callback) {
   var total_Users = await knex.select("*").from('USUARIOS')
  await knex.select("*")
     .from('USUARIOS').limit(limit).offset(offset)
     .asCallback(function(error, usuarios){
         if (usuarios.length > 0){
           success_select(usuarios,usuarios.length,offset,total_Users.length);
         }else
           error_callback();        
     })
 }

 app.get('/usuarios', function(pet, resp) {

   var limit = pet.query.limit;
   var offset = pet.query.offset;
  
   try{
      listarUsuarios(offset,limit,
          function(user,totalDatosPagina,offset,total_Users){
            resp.status(200);
            if(offset > 0){
                resp.send({Total_resultados:total_Users,
                  Limit:totalDatosPagina,
                offset:parseInt(offset),
                previous:"http://localhost:3000/usuarios?limit="+limit+"&offset="+(parseInt(offset)-1),
                after:"http://localhost:3000/usuarios?limit="+limit+"&offset="+(parseInt(offset)+1),
                
              user});
            }else{
              resp.send({Total_resultados:total_Users,
                Limit:totalDatosPagina,
                offset:offset,
                previous:"http://localhost:3000/usuarios?limit="+limit+"&offset="+(offset),
                after:"http://localhost:3000/usuarios?limit="+limit+"&offset="+(parseInt(offset)+1),
              user});
            }
          },
          function(){
          resp.status(404)
          resp.send({mensaje:"No hay usuarios registrados"})
          })          
   } catch{
    resp.status(500)
    resp.send({mensaje:"No se ha podido conectar a la base de datos"})
   }
 })
  

 function crearUsuario(nom,ape,email,direcc,password,success_callback, error_callback) {
   knex('USUARIOS').insert({NOMBRE:nom,APELLIDO:ape,EMAIL:email,DIRECCION:direcc,PASSWORD:password})
     .asCallback(function(error,resp){
         if (resp)
           success_callback()
         else
           error_callback()     
     })
 }
 
 app.post('/usuario', function(pet, resp) {
   var body = pet.body
   try{
      crearUsuario(body.NOMBRE,body.APELLIDOS,body.EMAIL,body.DIRECCION,body.PASSWORD,
        function(){
          resp.status(201)
          resp.send({mensaje:"Usuario creado con éxito"})
        },
        function() {
          resp.status(400)
          resp.send({mensaje:"Usuario no creado"})
        })
    }catch{
      resp.status(500)
      resp.send({mensaje:"No se ha podido conectar a la base de datos"})
    }
 })

 function crearProducto(nom,precio,disp,success_callback, error_callback) {
  knex('PRODUCTO').insert({NOMBRE:nom,PRECIO:precio,DISPONIBILIDAD:disp})
    .asCallback(function(error,resp){
        if (resp)
          success_callback()
        else
          error_callback()     
    })
}

app.post('/producto', chequeaJWT, function(pet, resp) {
  var body = pet.body

  try{
     crearProducto(body.NOMBRE,body.PRECIO,body.DISPONIBILIDAD,
       function(){
         resp.status(201)
         resp.send({mensaje:"Producto creado con éxito"})
       },
       function() {
         resp.status(400)
         resp.send({mensaje:"Producto no creado"})
       })
   }catch{
     resp.status(500)
     resp.send({mensaje:"No se ha podido conectar a la base de datos"})
   }
})

 function borrarProducto(id,success_callback, error_callback) {
  knex('PRODUCTO')
    .where({ID:id}).del()
    .asCallback(function(error,resp){
        if (resp)
          success_callback()
        else
          error_callback()     
    })
}

app.delete('/productos/:id',chequeaJWT, function(pet, resp) {
  var id = parseInt(pet.params.id)
  try{
      borrarProducto(id,
        function(){
          resp.status(200)
          resp.send({mensaje:"Producto borrado con exito"})
        },
        function() {
          resp.status(404);
          resp.send({mensaje:"No se ha encontrado el producto"})
        })
  }catch{
    resp.status(500)
    resp.send({mensaje:"No se ha podido conectar a la base de datos"})
  }
})


function updateUsuario(id,nom,ape,email,direcc,password,admin,carro,success_callback, error_callback) {
  knex.update({ID:id,NOMBRE:nom,APELLIDOS:ape,EMAIL:email,DIRECCION:direcc,PASSWORD:password,ADMIN:admin,ID_CARRO:carro})
    .from("USUARIOS")
    .where({ID:id})
    .asCallback(function(error,resp){
        if (resp)
          success_callback()
        else
          error_callback()     
    })
}

app.put('/usuario', function(pet, resp) {
  var body = pet.body
  try{
      updateUsuario(body.ID,body.NOMBRE,body.APELLIDOS,body.EMAIL,body.DIRECCION,body.PASSWORD,body.ADMIN,body.ID_CARRO,
        function(){
          resp.status(204)
          resp.send({mensaje:"Usuario actualizado con exito"})
        },
        function() {
          resp.status(404);
          resp.send({mensaje:"No se ha encontrado el usuario"})
        })
  }catch{
    resp.status(500)
    resp.send({mensaje:"No se ha podido conectar a la base de datos"})
  }
})



function listarProductos(success_select,error_callback) {
  knex.select("*")
    .from('producto')
    .asCallback(function(error, productos){
        if (productos.length > 0){
          success_select(productos);
        }else
          error_callback();        
    })
}

app.get('/productos', chequeaJWT,  function(pet, resp) {
  try{
      listarProductos(
        function(productos){
            resp.status(200);
            resp.send(productos);
        },
        function(){
          resp.status(404)
          resp.send({mensaje:"No se ha podido conectar a la base de datos"})
        })
  }catch{
    resp.status(500)
    resp.send({mensaje:"No se ha podido conectar a la base de datos"})
  }     
})


function listarCategoriasProductos(success_select,error_callback) {
  knex.select("*")
    .from("CATEGORIA")
    .innerJoin("PRODUCTO","producto.CATEGORIA","CATEGORIA.id")
    .distinct("categoria.id")
    .asCallback(function(error, productos){
        if (productos.length > 0){
          success_select(productos);
        }else
          error_callback();        
    })
}

app.get('/categorias/productos',  function(pet, resp) {
  try{
      listarCategoriasProductos(
        function(allCategorias){
            resp.status(200);
            resp.send(allCategorias);
        },
        function(){
          resp.status(404)
          resp.send({mensaje:"No se ha encontrado ninguna categoría"})
        })
  }catch{
    resp.status(500)
    resp.send({mensaje:"No se ha podido conectar a la base de datos"})
  }     
})



app.listen(3000, function () {
   console.log("El servidor express está en el puerto 3000");
});