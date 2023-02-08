import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { GoogleAuthProvider } from '@angular/fire/auth';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  

  constructor( private fireauth: AngularFireAuth, private router: Router) {}

  // Login method
  login(email: string, password: string){
    this.fireauth.signInWithEmailAndPassword(email, password).then( res => {
        localStorage.setItem('token', 'true');
        
        if(res.user?.emailVerified == true){
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/verify-email']);
        }
    }, err => {
        //alert(err.message);
        alert('Bad credential!');
        this.router.navigate(['/login']);
    });
    
  }

  // Register Method
  register(email: string, password: string){
    this.fireauth.createUserWithEmailAndPassword(email, password).then( () => {
        alert('Register Successfull');
        this.router.navigate(['/login']);
        this.sendEmailForVerification();
    }, err => {
        alert(err.message);
        this.router.navigate(['/register']);
    });
  }

  // Logout Method
  logout(){
    this.fireauth.signOut().then( () => {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }, err => {
      alert(err.message);
    })
  }

  // Forgot password
  forgotPassword(email: string){
    this.fireauth.sendPasswordResetEmail(email).then( () => {
      this.router.navigate(['/verify-email']);
    }, err => {
      alert('Something went wrong');
    })
  }

  // email verification
  sendEmailForVerification(){
      this.fireauth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['/verify-email']);
      }); 
  }

  //Sign In With Google
  googleSignIn(){
    this.fireauth.signInWithPopup(new GoogleAuthProvider).then( res => {
      this.router.navigate(['/dashboard']);
      localStorage.setItem('token', JSON.stringify(res.user?.uid));
    }, err => {
      alert(err.message);
    })
  }

  

  authenticated() : boolean {
    //this.fireauth.currentUser.
    if(localStorage.getItem('user') || localStorage.getItem('token')){
      return true;
    } else {
      return false;
    }
    
  }
  

  
  
}
