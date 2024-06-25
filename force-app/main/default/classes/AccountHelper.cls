public with sharing class AccountHelper {
    @AuraEnabled(cacheable=true)
    public static List<Account> findAccount(String s) {
        String queryString = '%' + s + '%';
        List<Account> accList = [SELECT Id, Name FROM Account WHERE Name LIKE :queryString];
        return accList;
    }
}