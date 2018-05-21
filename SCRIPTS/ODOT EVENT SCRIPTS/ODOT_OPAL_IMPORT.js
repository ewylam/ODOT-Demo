if (appStatus == "Pending") {
	var envParameters = aa.util.newHashMap();
	envParameters.put("CapId", capId);
	envParameters.put("Update", getAppSpecific("Update Existing?"));
	aa.env.setValue("CapId", capId);
	aa.env.setValue("Update", getAppSpecific("Update Existing?"));
	vAsyncScript = "ODOT_OPAL_IMPORT_ASYNC";
	logDebug("Calling ASync Script: " + vAsyncScript);
	aa.runAsyncScript(vAsyncScript, envParameters);
}