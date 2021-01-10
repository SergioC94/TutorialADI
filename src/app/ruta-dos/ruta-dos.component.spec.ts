import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RutaDosComponent } from './ruta-dos.component';

describe('RutaDosComponent', () => {
  let component: RutaDosComponent;
  let fixture: ComponentFixture<RutaDosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RutaDosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RutaDosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
