public with sharing class AccountTriggerHelper {
    public static void checkIsDeleteable(Map<Id, Account> accMap) {
        // Query for opportunities related to the accounts being deleted
        List<Opportunity> oppList = [SELECT Id, StageName FROM Opportunity WHERE AccountId IN :accMap.keySet()];

        // Create a set of account IDs that have open opportunities
        Set<Id> accountIdsWithOpenOpps = new Set<Id>();

        // If there are open opportunities related to these accounts, throw an error
        for (Opportunity opp : oppList) {
            if (opp.StageName != 'Closed Won' && opp.StageName != 'Closed Lost') {
                accountIdsWithOpenOpps.add(opp.AccountId);
            }
        }
        
        // Add error to accounts with open opportunities
        for (Id accId : accountIdsWithOpenOpps) {
            if (accMap.containsKey(accId)) {
                accMap.get(accId).addError('This account cannot be deleted because it has related opportunities that are not closed.');
            }
        }
    }
}