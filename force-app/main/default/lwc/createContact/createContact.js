// createContact.js
import { LightningElement, api } from 'lwc';
import createContact from '@salesforce/apex/ContactController.createContact';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CreateContact extends LightningElement {
    @api contact = {
        FirstName: '',
        LastName: '',
        AccountId: ''
    };

    handleAccountSelected(event) {
        const selectedAccount = event.detail;
        this.contact.AccountId = selectedAccount.Id;
        this.selectedAccountName = selectedAccount.Name;
        console.log('Selected Account:', selectedAccount.Name); // For debugging
    }

    handleFirstNameChange(event) {
        this.contact.FirstName = event.target.value;
    }

    handleLastNameChange(event) {
        this.contact.LastName = event.target.value;
    }

    handleSave() {
        console.log('Save button clicked');
        createContact({ contactData: this.contact })
            .then(() => {
                console.log('Contact created successfully');
                this.showToast('Success', 'Contact created successfully', 'success');
            })
            .catch(error => {
                console.log('Error creating contact:', error);
                this.showToast('Error', 'Error creating contact: ' + error.body.message, 'error');
            });
    }

    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: title,
                message: message,
                variant: variant,
            }),
        );
    }
}