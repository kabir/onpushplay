import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import {AppComponent, HeaderComponent, HeadersComponent} from './app.component';
import {StateComponent} from './app.component';
import {ItemComponent} from './app.component';
import {FlexboxComponent} from './flexbox.component';

@NgModule({
  declarations: [
    AppComponent,
    FlexboxComponent,
    HeaderComponent,
    HeadersComponent,
    ItemComponent,
    StateComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [FlexboxComponent]
})
export class AppModule { }
