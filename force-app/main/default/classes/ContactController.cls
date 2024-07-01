public with sharing class ContactController {
    @AuraEnabled(cacheable=true)
    public static void createContact(Contact contactData) {
        insert contactData;
    }
}