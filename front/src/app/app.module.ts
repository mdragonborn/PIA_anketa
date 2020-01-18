import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {UserService} from './user.service';
import { HttpClientModule } from '@angular/common/http';
import { LogoutComponent } from './logout/logout.component';
import { ChangePwdComponent } from './change-pwd/change-pwd.component';
import { AdminComponent } from './admin/admin.component';
import { IspitanikHomeComponent } from './ispitanik-home/ispitanik-home.component';
import { KreatorHomeComponent } from './kreator-home/kreator-home.component';
import { NewTestComponent } from './new-test/new-test.component';
import { NewQuestionComponent } from './new-question/new-question.component';
import { TestsService } from './tests.service';
import { TestDetailsComponent } from './test-details/test-details.component';
import { TestingComponent } from './testing/testing.component';
import { DisplayQuestionComponent } from './display-question/display-question.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import {CountdownModule} from 'ngx-countdown';
import { ScoreBarChartComponent } from './score-bar-chart/score-bar-chart.component';
import {NgxChartsModule} from '@swimlane/ngx-charts'

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QuestionStatChartComponent } from './question-stat-chart/question-stat-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    LogoutComponent,
    ChangePwdComponent,
    AdminComponent,
    IspitanikHomeComponent,
    KreatorHomeComponent,
    NewTestComponent,
    NewQuestionComponent,
    TestDetailsComponent,
    TestingComponent,
    DisplayQuestionComponent,
    ProgressBarComponent,
    ScoreBarChartComponent,
    QuestionStatChartComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CountdownModule,
    NgxChartsModule,
    BrowserAnimationsModule
  ],
  providers: [
    UserService,
    TestsService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
