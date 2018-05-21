if ((wfTask == "Application Acceptance" || wfTask == "Plan Review") && wfStatus == "Supplemental Information Requested") {
	var vEParams = aa.util.newHashtable();
	addParameter(vEParams, "$$ApplicationID$$", capIDString);
	emailContacts_BCC("All", "ODOT SUPPLEMENTAL INFO REQUESTED", vEParams, vRParams);
}
