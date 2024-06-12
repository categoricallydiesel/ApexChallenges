trigger AccountTrigger on Account (before delete) {
    switch on Trigger.operationType {
        when BEFORE_INSERT {
        }
        when BEFORE_UPDATE {
        }
        when BEFORE_DELETE {
            AccountTriggerHelper.checkIsDeleteable(Trigger.oldMap);
        }
        when AFTER_INSERT {
        }
        when AFTER_UPDATE {
        }
        when AFTER_DELETE {
        }
        when AFTER_UNDELETE {
        }
    }
}