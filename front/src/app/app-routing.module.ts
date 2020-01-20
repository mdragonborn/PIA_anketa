import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { LogoutComponent } from './logout/logout.component';
import { ChangePwdComponent } from './change-pwd/change-pwd.component';
import { AdminComponent } from './admin/admin.component';
import { KreatorHomeComponent } from './kreator-home/kreator-home.component';
import { IspitanikHomeComponent } from './ispitanik-home/ispitanik-home.component';
import { NewTestComponent } from './new-test/new-test.component';
import { TestDetailsComponent } from './test-details/test-details.component';
import { TestingComponent } from './testing/testing.component';


const routes: Routes = [
  {path:'', redirectTo:'login', pathMatch:'full'},
  {path:'login', component:LoginComponent},
  {path:'register', component:RegisterComponent},
  {path:'home', component:HomeComponent},
  {path:'logout', component:LogoutComponent},
  {path:'changepwd', component:ChangePwdComponent},
  {path: 'admin', component:AdminComponent},
  {path: 'kreator', component:KreatorHomeComponent},
  {path: 'isp', component: IspitanikHomeComponent},
  {path: 'kreator/new', component: NewTestComponent},
  {path: 'kreator/details/:id', component: TestDetailsComponent},
  {path: 'testing/:id/:username', component: TestingComponent},
  {path: 'testing/:id', component: TestingComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
