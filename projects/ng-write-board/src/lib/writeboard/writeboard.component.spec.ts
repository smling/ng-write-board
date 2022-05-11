import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { WriteboardComponent } from './writeboard.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { WriteBoardOption } from './write-board-option';
import { By } from '@angular/platform-browser';

describe('WriteboardComponent', () => {
  let component: WriteboardComponent;
  let fixture: ComponentFixture<WriteboardComponent>;

  const defaultWriteboardOption : WriteBoardOption = new WriteBoardOption();
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
