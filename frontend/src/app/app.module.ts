import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { NavbarComponent } from './global/shared/navbar/navbar.component';
import { NotificationHubComponent } from './global/shared/notification-hub/notification-hub.component';
import { PillContainerComponent } from './global/shared/pill-container/pill-container.component';
import { PillCardComponent } from './global/shared/pill-card/pill-card.component';

const socketIoConfig: SocketIoConfig = { url: environment.host, options: {} };
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    SocketIoModule.forRoot(socketIoConfig),
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NavbarComponent,
    NotificationHubComponent,
    PillContainerComponent,
    PillCardComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
