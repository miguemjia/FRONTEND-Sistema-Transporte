import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-redirect',
  standalone: true,
  template: ``,
})
export class AppRedirectComponent implements OnInit {
  private readonly router = inject(Router);

  ngOnInit(): void {
    const role = localStorage.getItem('role');
    const target = role === 'admin' ? '/app/administradores' : '/app/cliente';
    this.router.navigateByUrl(target);
  }
}
