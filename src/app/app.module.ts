import { BrowserModule           } from '@angular/platform-browser';
import { NgModule                } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatIconModule    } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AppComponent     } from './app.component';
import { MessageComponent } from '../components/message-component/message.component';

const MATERIAL_MODULES: any[] = [
  MatIconModule,
  MatToolbarModule,
  MatTooltipModule,
];

const LOCAL_DECLARATIONS: any[] = [
  AppComponent,
  MessageComponent,
];

@NgModule({
  declarations: LOCAL_DECLARATIONS,
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MATERIAL_MODULES,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
