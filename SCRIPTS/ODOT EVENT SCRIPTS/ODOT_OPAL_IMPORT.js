var capId = aa.env.getValue("CapId");
var SCRIPT_VERSION = 3.0;
aa.env.setValue("CurrentUserID", "ADMIN");
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, true));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS", null, true));
eval(getScriptText("INCLUDES_CUSTOM", null, true));

function getScriptText(vScriptName, servProvCode, useProductScripts) {
	if (!servProvCode)
		servProvCode = aa.getServiceProviderCode();
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		if (useProductScripts) {
			var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
		} else {
			var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
		}
		return emseScript.getScriptText() + "";
	} catch (err) {
		return "";
	}
}

logDebug("Here in SDOT_Async_Script_90");
aa.print("Here in SDOT_Async_Script_90");

eval(getScriptText("INCLUDES_DATA_LOAD", null, false));

//govXMLURL = "http://156.74.173.41:3080/wireless/GovXMLServlet";
govXMLURL = lookup("SDOT_FCC_LOADER", "Endpoint");
vUsername = lookup("SDOT_FCC_LOADER", "Username");
vPassword = lookup("SDOT_FCC_LOADER", "Password");

emailText = "";
batchJobName = "";
batchJobID = 0;

var docListArray = new Array();
docListResult = aa.document.getCapDocumentList(capId,'ADMIN');
if (docListResult.getSuccess()) { 
	docListArray = docListResult.getOutput();
	for (dIndex in docListArray) {
		documentObject = docListArray[dIndex];
		docFileName = documentObject.getFileName();
		//logDebug("Document Found: " + docFileName + " : " + documentObject.getDocCategory());
		docCategory = documentObject.getDocCategory();
		if (docCategory == "Vehicle License List") {
			//logDebug("Correct Document Found: " + docFileName + " : " + documentObject.getDocCategory());
			var docFileKey = documentObject.getFileKey();
			//get the content of the doc
			docContent = downloadDoc(capId, docFileKey, true, govXMLURL, 'SEATTLE', vUsername, vPassword);
			docContent = docContent.trim();
			//logDebug("Content: " + docContent);
			//aa.print("Content: " + docContent);
			lineArray = docContent.split("\n");
			qty = 0;
			for (lIndex in lineArray) {
				thisLine = lineArray[lIndex];
				thisLine = String(thisLine);
				thisLine = thisLine.trim();
				logDebug("lIndex: " + lIndex);
				aa.print("lIndex: " + lIndex);
				logDebug("lineArray.length: " + lineArray.length);
				aa.print("lineArray.length: " + lineArray.length);
				/*
				if (lIndex == (lineArray.length - 1)) {
					logDebug("ThisLine: PASS" + thisLine);
					aa.print("ThisLine: PASS" + thisLine);
					continue;
				}
				*/
				/*
				if (!doesASITRowExist("PERMIT INFORMATION", "Vehicle License #", thisLine)) {
					newRow = new Array();
					newRow["Vehicle License #"] = new asiTableValObj("Vehicle License #", thisLine, "N");
					vInitialFee = getRefFeeCalcFormula('SDOT_FFC_010', 'SDOT_FFC');
					newRow["Initial Fee"] = new asiTableValObj("Initial Fee", vInitialFee, "N");
					newRow["Permit Status"] = new asiTableValObj("Permit Status", "", "N");
					newRow["Status Date"] = new asiTableValObj("Status Date", "", "N");
					newRow["First Effective Date"] = new asiTableValObj("First Effective Date", "", "N");
					newRow["Effective Date"] = new asiTableValObj("Effective Date", "", "N");
					newRow["First Issued Date"] = new asiTableValObj("First Issued Date", "", "N");
					newRow["Expiration Date"] = new asiTableValObj("Expiration Date", "", "N");
					newRow["Credential Solutions Date"] = new asiTableValObj("Credential Solutions Date", "", "N");
					newRow["State Registered"] = new asiTableValObj("State Registered", "WA", "N");
					newRow["Verification Status"] = new asiTableValObj("Verification Status", verifyVehicle_SDOT(thisLine), "N");
					newRow["Verification Status Date"] = new asiTableValObj("Verification Status Date", dateAdd(null, 0), "N");
					addToASITable("PERMIT INFORMATION", newRow);
					qty++;
				}
				*/
			}
		}
	}
	logDebug("Here in SDOT_Async_Script_90 Complete");
	aa.print("Here in SDOT_Async_Script_90 Complete");
}

updateTask("Review","Review Required","Updated by SDOT Script 90","Updated by SDOT Script 90", "", capId);