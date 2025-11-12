import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { HeaderComponent } from './global/shared/header/header.component';
import { NavbarComponent } from './global/shared/navbar/navbar.component';
import { NotificationHubComponent } from './global/shared/notification-hub/notification-hub.component';
import { PillNotificationComponent } from './global/shared/notification-hub/pill-notification/pill-notification.component';
import { MonthEndNotificationComponent } from './global/shared/notification-hub/month-end-notification/month-end-notification.component';
import { PillContainerComponent } from './global/shared/pill-container/pill-container.component';
import { PillCardComponent } from './global/shared/pill-card/pill-card.component';



const socketIoConfig: SocketIoConfig = { url: environment.host, options: {} };
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    SocketIoModule.forRoot(socketIoConfig),
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HeaderComponent,
    NavbarComponent,
    NotificationHubComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
