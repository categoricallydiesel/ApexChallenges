public with sharing class AccountSearchController {
    @AuraEnabled(cacheable=true)
    public static List<Account> searchAccounts(String searchTerm) {
        String likeSearchTerm = '%' + searchTerm + '%';
        return [SELECT Id, Name FROM Account WHERE Name LIKE :likeSearchTerm LIMIT 10];
    }
}