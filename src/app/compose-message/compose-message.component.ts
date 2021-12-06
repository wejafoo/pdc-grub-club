

import { environment	} from '../../environments/environment';
import { Component		} from '@angular/core';
import { Router			} from '@angular/router';

@Component({
	selector: 'app-compose-message',
	templateUrl: './compose-message.component.html',
	styleUrls: ['./compose-message.component.sass']
})

export class ComposeMessageComponent {
	env:	any;
	debug:	boolean;
	details	= '';
	message	= '';
	sending	= false;
	
	constructor ( private router: Router ) {
		this.env	= environment;
		this.debug	= this.env.debug
	}
	send() {
		this.sending = true;
		this.details = 'Sending Message...';
		setTimeout(() => {
			this.sending = false;
			this.closePopup()
		}, 1000 )
	}
	cancel() {
		this.closePopup()
	}
	closePopup() {
		this.router.navigate([{ outlets: { popup: null }}]).then(r => {console.log(r)})
	}
}
