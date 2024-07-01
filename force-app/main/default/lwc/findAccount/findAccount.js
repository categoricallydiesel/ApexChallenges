import { LightningElement, track } from 'lwc';
import searchAccounts from '@salesforce/apex/AccountSearchController.searchAccounts';

export default class FindAccount extends LightningElement {
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

// import { LightningElement, wire } from 'lwc'; // Importing necessary modules from LWC framework
// import findAccount from '@salesforce/apex/AccountHelper.findAccount'; // Importing the Apex method to find accounts

// export default class FindAccount extends LightningElement {
//     inputValue = ''; // Property to hold the user input value
//     accounts; // Property to hold the list of accounts fetched from the Apex method

//     // Method to handle changes in the input field
//     handleInputChange(event) {
//         this.inputValue = event.target.value; // Update the inputValue property with the current value of the input field
        
//         // If the input field is empty, clear the accounts property
//         if (this.inputValue === '') {
//             this.accounts = undefined;
//         }
//     }

//     // Wire service to call the Apex method when inputValue changes
//     @wire(findAccount, { s: '$inputValue' })
//     wiredAccounts({ error, data }) {
//         // If the input field is empty, ensure the accounts property is undefined
//         if (this.inputValue === '') {
//             this.accounts = undefined;
//         } 
//         // If data is returned from the Apex method, set the accounts property with the fetched data
//         else if (data) {
//             this.accounts = data;
//         } 
//         // If there is an error, clear the accounts property and log the error
//         else if (error) {
//             this.accounts = undefined;
//             console.error('Error:', error);
//         }
//     }

//     // Getter method to check if there are any accounts
//     get hasAccounts() {
//         return this.accounts && this.accounts.length > 0;
//     }

//     // Getter method to check if there are no accounts
//     get noAccounts() {
//         return this.accounts && this.accounts.length === 0;
//     }

//     // Getter method to check if the search input is empty and no accounts are fetched
//     get isSearchEmpty() {
//         return !this.accounts;
//     }
// }
