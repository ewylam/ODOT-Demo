if (appStatus == "Pending") {
	var envParameters = aa.util.newHashMap();
	envParameters.put("CapId", capId);
	aa.env.setValue("CapId", capId);
	vAsyncScript = "ODOT_OPAL_IMPORT_ASYNC";
	logDebug("Calling ASync Script: " + vAsyncScript);
	aa.runAsyncScript(vAsyncScript, envParameters);
}