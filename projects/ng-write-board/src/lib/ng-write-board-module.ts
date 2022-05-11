import { NgModule } from '@angular/core';
import { WriteboardComponent } from './writeboard/writeboard.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';


@NgModule({
  declarations: [
    WriteboardComponent
  ],
  imports: [
    HttpClientModule, BrowserModule
  ],
  exports: [
    WriteboardComponent
  ]
})
export class NgWriteboardModule { }
