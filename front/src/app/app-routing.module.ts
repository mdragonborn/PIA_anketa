import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { LogoutComponent } from './logout/logout.component';
import { ChangePwdComponent } from './change-pwd/change-pwd.component';
import { AdminComponent } from './admin/admin.component';
import { KreatorhomeComponent } from './kreatorhome/kreatorhome.component';
import { IspitanikhomeComponent } from './ispitanikhome/ispitanikhome.component';
import { NewtestComponent } from './newtest/newtest.component';


const routes: Routes = [
  {path:'', redirectTo:'login', pathMatch:'full'},
  {path:'login', component:LoginComponent},
  {path:'register', component:RegisterComponent},
  {path:'home', component:HomeComponent},
  {path:'logout', component:LogoutComponent},
  {path:'changepwd', component:ChangePwdComponent},
  {path: 'admin', component:AdminComponent},
  {path: 'kreator', component:KreatorhomeComponent},
  {path: 'isp', component: IspitanikhomeComponent},
  {path: 'kreator/new', component: NewtestComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
