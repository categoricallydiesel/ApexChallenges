import { createElement } from 'lwc';
import CreateContact from 'c/createContact';
import { ShowToastEventName } from 'lightning/platformShowToastEvent';
import createContact from '@salesforce/apex/ContactController.createContact';

// Mock the apex method
jest.mock(
    '@salesforce/apex/ContactController.createContact',
    () => {
        return {
            default: jest.fn()
        };
    },
    { virtual: true }
);

describe('c-create-contact', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
    });

    it('initializes with empty form', () => {
        const element = createElement('c-create-contact', {
            is: CreateContact
        });
        document.body.appendChild(element);

        const inputFields = element.shadowRoot.querySelectorAll('lightning-input');
        expect(inputFields[0].value).toBeFalsy();
        expect(inputFields[1].value).toBeFalsy();
    });

    it('updates contact data when input changes', () => {
        const element = createElement('c-create-contact', {
            is: CreateContact
        });
        document.body.appendChild(element);

        const inputFields = element.shadowRoot.querySelectorAll('lightning-input');
        inputFields[0].value = 'John';
        inputFields[0].dispatchEvent(new CustomEvent('change'));
        inputFields[1].value = 'Doe';
        inputFields[1].dispatchEvent(new CustomEvent('change'));

        return Promise.resolve().then(() => {
            expect(element.contact.FirstName).toBe('John');
            expect(element.contact.LastName).toBe('Doe');
        });
    });

    it('calls createContact method when save button is clicked', () => {
        const element = createElement('c-create-contact', {
            is: CreateContact
        });
        document.body.appendChild(element);

        // Set up a resolved promise for the Apex call
        createContact.mockResolvedValue({});

        // Simulate user input
        const inputFields = element.shadowRoot.querySelectorAll('lightning-input');
        inputFields[0].value = 'John';
        inputFields[0].dispatchEvent(new CustomEvent('change'));
        inputFields[1].value = 'Doe';
        inputFields[1].dispatchEvent(new CustomEvent('change'));

        // Click the save button
        const saveButton = element.shadowRoot.querySelector('lightning-button');
        saveButton.click();

        return Promise.resolve().then(() => {
            expect(createContact).toHaveBeenCalledWith({
                contactData: expect.objectContaining({
                    FirstName: 'John',
                    LastName: 'Doe'
                })
            });
        });
    });

    // it('shows success toast when contact is created successfully', () => {
    //     const element = createElement('c-create-contact', {
    //         is: CreateContact
    //     });
    //     document.body.appendChild(element);

    //     // Set up a resolved promise for the Apex call
    //     createContact.mockResolvedValue({});

    //     // Mock the toast event
    //     const handler = jest.fn();
    //     element.addEventListener(ShowToastEventName, handler);

    //     // Click the save button
    //     const saveButton = element.shadowRoot.querySelector('lightning-button');
    //     saveButton.click();

    //     return Promise.resolve().then(() => {
    //         expect(handler).toHaveBeenCalled();
    //         expect(handler.mock.calls[0][0].detail.variant).toBe('success');
    //     });
    // });

    // it('shows error toast when contact creation fails', () => {
    //     const element = createElement('c-create-contact', {
    //         is: CreateContact
    //     });
    //     document.body.appendChild(element);

    //     // Set up a rejected promise for the Apex call
    //     createContact.mockRejectedValue({ body: { message: 'Test error' } });

    //     // Mock the toast event
    //     const handler = jest.fn();
    //     element.addEventListener(ShowToastEventName, handler);

    //     // Click the save button
    //     const saveButton = element.shadowRoot.querySelector('lightning-button');
    //     saveButton.click();

    //     return Promise.resolve().then(() => {
    //         expect(handler).toHaveBeenCalled();
    //         expect(handler.mock.calls[0][0].detail.variant).toBe('error');
    //     });
    // });

    // it('handles account selection from child component', () => {
    //     const element = createElement('c-create-contact', {
    //         is: CreateContact
    //     });
    //     document.body.appendChild(element);

    //     const accountSearchComponent = element.shadowRoot.querySelector('c-account-search');
    //     accountSearchComponent.dispatchEvent(new CustomEvent('accountselected', {
    //         detail: { Id: '001xxx000000000AAA', Name: 'Test Account' }
    //     }));

    //     return Promise.resolve().then(() => {
    //         expect(element.contact.AccountId).toBe('001xxx000000000AAA');
    //         expect(element.selectedAccountName).toBe('Test Account');
    //     });
    // });
});