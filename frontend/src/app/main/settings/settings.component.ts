import { Component } from '@angular/core';
import { ToastService } from 'src/services/shared/toast.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ProfileService } from 'src/services/profile.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  standalone: false,
})
export class SettingsComponent {
  constructor(
    private profileService: ProfileService,
    private toastService: ToastService
  ) {}
  loader = false;

  profileForm = new FormGroup({
    fname: new FormControl(''),
    lname: new FormControl(''),
    password: new FormControl(''),
    rePassword: new FormControl(''),
    website: new FormControl(''),
    bio: new FormControl(''),
    gender: new FormControl(''),
    photoUrl: new FormControl<File | null>(null),
  });

  ngOnInit() {
    this.load();
  }

  onSubmit() {
    const fname = this.profileForm.get('fname')?.value?.trim();
    const lname = this.profileForm.get('lname')?.value?.trim();
    const password = this.profileForm.get('password')?.value?.trim();
    const rePassword = this.profileForm.get('rePassword')?.value?.trim();
    const bio = this.profileForm.get('bio')?.value?.trim();
    const website = this.profileForm.get('website')?.value?.trim();
    const gender = this.profileForm.get('gender')?.value?.trim();
    const photoUrl = this.profileForm.get('photoUrl')?.value;

    if (
      !fname &&
      !lname &&
      !password &&
      !gender &&
      !bio &&
      !website &&
      !photoUrl
    ) {
      this.toastService.error({
        message: 'Please fill the form',
        autohide: true,
      });
      return;
    }

    if (password && password !== rePassword) {
      console.log(password);
      console.log(rePassword);
      this.toastService.error({
        message: 'Password and rePassword should match',
        autohide: true,
      });
      return;
    }

    const formData = new FormData();
    if (fname) formData.append('fname', fname);
    if (lname) formData.append('lname', lname);
    if (password) formData.append('password', password);
    if (gender) formData.append('gender', gender);
    if (bio) formData.append('bio', bio);
    if (website) formData.append('website', website);
    if (photoUrl) formData.append('photoUrl', photoUrl);

    for (const [key, value] of (formData as any).entries()) {
      console.log(key, value);
    }

    this.profileService.edit(formData).subscribe({
      next: (res: string) => {
        this.toastService.show({
          message: res,
          autohide: true,
        });
      },
      error: (err) => {
        console.error(err);
        this.toastService.error({
          message: 'Cannot save the changes: Please try again later',
          autohide: true,
        });
      },
      complete: () => {
        this.profileForm.reset();
      },
    });
  }

  upload($event: Event) {
    if (!($event.target as HTMLInputElement)) {
      return;
    }
    const input = $event.target as HTMLInputElement;
    const file = input && input.files ? input.files[0] : null;
    this.profileForm.patchValue({
      photoUrl: file,
    });
  }

  load() {
    this.loader = true;
    setTimeout(() => {
      this.loader = false;
    }, 1000);
  }
}
