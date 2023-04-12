import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiComponentModule } from '../ui-component/ui-component.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { LayoutComponent } from './components/layout/layout.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RouterModule } from '@angular/router';
import { ConnectionsComponent } from './components/connections/connections.component';
import { ProfileStatusComponent } from './components/profile-status/profile-status.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { CoreModule } from 'src/app/core/core.module';
import { EventsComponent } from './components/events/events.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { TgtTasksComponent } from './components/tasks/tgt-tasks/tgt-tasks.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileFormComponent } from './components/profile/profile-form/profile-form.component';
import { ProfessionalHistoryComponent } from './components/profile/professional-history/professional-history.component';
import { PersonalDetailsComponent } from './components/profile/personal-details/personal-details.component';
import { PatentsAndIpComponent } from './components/profile/patents-and-ip/patents-and-ip.component';
import { AwardsAndCertifIcationsComponent } from './components/profile/awards-and-certifIcations/awards-and-certifIcations.component';
import { AdditionalDetailsComponent } from './components/profile/additional-details/additional-details.component';
import { AcademicsComponent } from './components/profile/academics/academics.component';
import { TrendingInvestorComponent } from './components/trending-investor/trending-investor.component';
import { RecentDealsComponent } from './components/recent-deals/recent-deals.component';
import { RecentDealsListingComponent } from './components/recent-deals-listing/recent-deals-listing.component';
import { ChubCollaborationComponent } from './components/chub-collaboration/chub-collaboration.component';
import { MatCarouselModule } from '@ngmodule/material-carousel';
import { DocumentsComponent } from './components/documents/documents.component';
import { TrendingNewsComponent } from './components/trending-news/trending-news.component';
import { ConnectLinkComponent } from './components/connect-link/connect-link.component';
import { GoalsComponent } from './components/chub-collaboration/goals/goals.component';
import { ConsultantComponent } from './components/chub-collaboration/consultant/consultant.component';
import { ServiceProviderComponent } from './components/chub-collaboration/service-provider/service-provider.component';
import { ChatBoxComponent } from './components/chub-collaboration/chat-box/chat-box.component';
import { ChubTasksComponent } from './components/chub-collaboration/chub-tasks/chub-tasks.component';
import { AddGoalComponent } from './components/add-goal/add-goal.component';
import { ConnectionCardComponent } from './components/connection-card/connection-card.component';
import { ConnectionRequestNotificationComponent } from './components/header/notifications/connection-request-notification/connection-request-notification.component';
import { GeneralNotificationComponent } from './components/header/notifications/general-notification/general-notification.component';
import { NotificationsComponent } from './components/header/notifications/notifications.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { ChubCollaborationListingComponent } from './components/chub-collaboration-listing/chub-collaboration-listing.component';
import { CollaborationsComponent } from './components/chub-collaboration-listing/collaborations/collaborations.component';
import { TgtAddUpdateTaskComponent } from './components/tasks/tgt-add-update-task/tgt-add-update-task.component';
import { DocumentsDrawerComponent } from './components/documents/documents-drawer/documents-drawer.component';
import { DocumentListComponent } from './components/documents/documents-drawer/document-list/document-list.component';
import { CompanyDocsListComponent } from './components/documents/documents-drawer/document-list/company-docs-list/company-docs-list.component';
import { ProfileDocsListComponent } from './components/documents/documents-drawer/document-list/profile-docs-list/profile-docs-list.component';
import { ChubDocsListComponent } from './components/documents/documents-drawer/document-list/chub-docs-list/chub-docs-list.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { UpcomingTaskComponent } from './components/calendar/upcoming-task/upcoming-task.component';
import { CompletedTaskComponent } from './components/calendar/completed-task/completed-task.component';
import { TgtAddUpdateEventComponent } from './components/events/tgt-add-update-event/tgt-add-update-event.component';
import { SettingsComponent } from './components/settings/settings.component';
import { VerifyOtpComponent } from './components/profile/personal-details/verify-otp/verify-otp.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { environment } from 'src/environments/environment';
import { SectorsComponent } from './components/sectors/sectors.component';

const config: SocketIoConfig = {
	url: environment.chatApiUrl, // socket server url;
	options: {
		transports: ["polling", "websocket"],
    autoConnect: false
	}
}


@NgModule({
  declarations: [
    HeaderComponent,
    LayoutComponent,
    SideNavComponent,
    PageNotFoundComponent,
    ConnectionsComponent,
    ProfileStatusComponent,
    WelcomeComponent,
    EventsComponent,
    TasksComponent,
    TgtTasksComponent,
    ProfileComponent,
    ProfileFormComponent,
    ProfessionalHistoryComponent,
    PersonalDetailsComponent,
    PatentsAndIpComponent,
    AwardsAndCertifIcationsComponent,
    AdditionalDetailsComponent,
    AcademicsComponent,
    TrendingInvestorComponent,
    TrendingNewsComponent,
    RecentDealsComponent,
    RecentDealsListingComponent,
    ChubCollaborationComponent,
    DocumentsComponent,
    ConnectLinkComponent,
    GoalsComponent,
    ConsultantComponent,
    ServiceProviderComponent,
    ChatBoxComponent,
    ChubTasksComponent,
    AddGoalComponent,
    ConnectionCardComponent,
    ConnectionRequestNotificationComponent,
    GeneralNotificationComponent,
    NotificationsComponent,
    ConfirmationDialogComponent,
    ChubCollaborationListingComponent,
    CollaborationsComponent,
    TgtAddUpdateTaskComponent,
    DocumentsDrawerComponent,
    DocumentListComponent,
    CompanyDocsListComponent,
    ProfileDocsListComponent,
    ChubDocsListComponent,
    CalendarComponent,
    UpcomingTaskComponent,
    CompletedTaskComponent,
    TgtAddUpdateEventComponent,
    SettingsComponent,
    VerifyOtpComponent,
    SectorsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UiComponentModule,
    RouterModule,
    CoreModule,
    InfiniteScrollModule,
    MatCarouselModule.forRoot(),
    SocketIoModule.forRoot(config), 
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  exports: [
    ConnectionsComponent,
    CoreModule,
    ProfileStatusComponent,
    EventsComponent,
    UiComponentModule,
    TasksComponent,
    ProfileComponent,
    TrendingInvestorComponent,
    TrendingNewsComponent,
    RecentDealsComponent,
    RecentDealsListingComponent,
    ChubCollaborationComponent,
    DocumentsComponent,
    ConnectLinkComponent,
    ConnectionCardComponent,
    ConfirmationDialogComponent,
    ChubCollaborationListingComponent,
    WelcomeComponent,
    CalendarComponent,
    SettingsComponent,
    SectorsComponent
  ]
})
export class SharedModule { }
