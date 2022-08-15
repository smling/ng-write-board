import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteboardComponent } from './writeboard.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

describe('WriteboardComponent', () => {
  let component: WriteboardComponent;
  let fixture: ComponentFixture<WriteboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WriteboardComponent ],
      imports: [HttpClientTestingModule],
      providers: [HttpClient]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WriteboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
