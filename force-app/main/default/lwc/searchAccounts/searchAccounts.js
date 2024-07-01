import { LightningElement, track } from 'lwc';
import searchAccounts from '@salesforce/apex/AccountSearchController.searchAccounts';

export default class AccountSearch extends LightningElement {
    @track searchTerm = '';
    @track accounts;
    @track selectedAccount;

    handleSearch(event) {
        this.searchTerm = event.target.value;
        if (this.searchTerm.length > 2) {
            this.searchAccounts();
        } else {
            this.accounts = null;
            this.selectedAccount = null;
        }
    }

    searchAccounts() {
        searchAccounts({ searchTerm: this.searchTerm })
            .then(result => {
                this.accounts = result;
            })
            .catch(error => {
                console.error('Error searching accounts:', error);
            });
    }

    selectAccount(event) {
        event.preventDefault(); // Prevent any default action
        event.stopPropagation(); // Stop the event from bubbling up
        const selectedId = event.currentTarget.dataset.id;
        this.selectedAccount = this.accounts.find(account => account.Id === selectedId);
        this.accounts = null; // Clear the search results
        // Dispatch an event to notify parent component of selection
        this.dispatchEvent(new CustomEvent('accountselected', {
            detail: this.selectedAccount
        }));
    }
}