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

aa.print("Here in SDOT_Async_Script_90");
aa.print("Here in SDOT_Async_Script_90");

eval(getScriptText("INCLUDES_DATA_LOAD", null, false));

govXMLURL = "http://192.168.168.105:3080/wireless/GovXMLServlet";
vUsername = "Admin";
vPassword = "admin";

emailText = "";
batchJobName = "";
batchJobID = 0;

var docListArray = new Array();
docListResult = aa.document.getCapDocumentList(capId, 'ADMIN');
if (docListResult.getSuccess()) {
	docListArray = docListResult.getOutput();
	aa.print(docListArray.length)
	for (dIndex in docListArray) {
		documentObject = docListArray[dIndex];
		docFileName = documentObject.getFileName();
		aa.print("Document Found: " + docFileName + " : " + documentObject.getDocCategory());
		docCategory = documentObject.getDocCategory();
		if (docCategory == "OPAL Project File") {
			aa.print("Correct Document Found: " + docFileName + " : " + documentObject.getDocCategory());
			var docFileKey = documentObject.getFileKey();
			//get the content of the doc
			docContent = downloadDoc(capId, docFileKey, true, govXMLURL, "CLOUD_ODOT", vUsername, vPassword);
			docContent = docContent.trim();
			//aa.print("Content: " + docContent);
			//aa.print("Content: " + docContent);
			lineArray = docContent.split("\n");
			qty = 0;
			for (lIndex in lineArray) {
				if (lIndex == 0) {
					continue;
				}
				//else if (lIndex > 5) {
				//	break;
				//}
				thisLine = lineArray[lIndex];
				thisLine = String(thisLine);
				thisLine = thisLine.trim();
				aa.print(thisLine);
				thisLineArray = thisLine.split(",");
				vODOTHighwayNumber = thisLineArray[0];
				vPermitType = thisLineArray[1];
				vApplicationStatus = thisLineArray[2];
				vCity = thisLineArray[3];
				vState = thisLineArray[4];
				vZipCode = thisLineArray[5];
				vMilePoint = thisLineArray[6];
				vLatitude = thisLineArray[7];
				vLongitude = thisLineArray[8];
				vUpermitHighway = thisLineArray[9];
				vUPermitMilePoint = thisLineArray[10];
				vPermitUpermit = thisLineArray[11];
				vRoadwayID = thisLineArray[12];
				vApplicationId = thisLineArray[13];
				vSideOfHighway = thisLineArray[14];
				vNewHighwayNumber = thisLineArray[15];
				vLastName = thisLineArray[16];
				vFirstName = thisLineArray[17];
				vAddress = thisLineArray[18];
				vPropertyCity = thisLineArray[19];
				vPropertyState = thisLineArray[20];
				vPropertyZipCode = thisLineArray[21];
				vPropertyFileRW = thisLineArray[22];
				vDistrict = thisLineArray[23];
				vNewApplicationStatus = thisLineArray[24];
				vNewMilePost = thisLineArray[25];
				vApproachWidth = thisLineArray[26];
				vNewApproachType = thisLineArray[27];

				if (vSideOfHighway == "R") {
					vSideOfHighway = "Right";
				} else if (vSideOfHighway == "L") {
					vSideOfHighway = "Left";
				}
				
				// Check to see if the Project record exists
				vProjectCapId = aa.cap.getCapID(vApplicationId);
				if (vProjectCapId.getSuccess()) {
					aa.print("Found Existing Record");
					vProjectCapId = vProjectCapId.getOutput();
				} else {
					vProjectCapId = createCap("Permits/Highway/Approach/Project", vAddress);

					// Update AltID
					aa.cap.updateCapAltID(vProjectCapId, vApplicationId);
					
					// Create Address
					// Get transactional address model
					vCapScriptModel = aa.cap.getCap(vProjectCapId).getOutput();
					vCapModel = vCapScriptModel.getCapModel();
					vAddrModel = vCapModel.getAddressModel();

					// Populate address model with Business address info
					/*
					vAddrModel.setHouseNumberStart(vAddress.getHouseNumberStart());
					vAddrModel.setStreetPrefix(vAddress.getStreetPrefix());
					vAddrModel.setStreetName(vAddress.getStreetName());
					vAddrModel.setStreetSuffix(vAddress.getStreetSuffix());
					vAddrModel.setStreetSuffixdirection(vAddress.getStreetSuffixDirection());
					vAddrModel.setUnitStart(vAddress.getUnitStart());
					vAddrModel.setUnitType(vAddress.getUnitType());
					 */
					vAddrModel.setAddressLine1(vAddress);
					vAddrModel.setCity(vPropertyCity);
					vAddrModel.setState(vPropertyState);
					vAddrModel.setZip(vPropertyZipCode);
					vAddrModel.setXCoordinator(parseFloat(vLatitude));
					vAddrModel.setYCoordinator(parseFloat(vLongitude));
					vAddrModel.setPrimaryFlag('Y');
					vAddrModel.setCapID(vProjectCapId);
					vAddrModel.setAuditID('ADMIN');

					// Save the address
					var vAddrResult = aa.address.createAddress(vAddrModel);
					if (!vAddrResult.getSuccess()) {
						aa.print("Failed creating transactional address. " + vAddrResult.getErrorMessage());
					} else {
						vAddrModelArry = aa.address.getAddressWithAttributeByCapId(vProjectCapId);
						if (vAddrModelArry.getSuccess()) {
							vAddrModelArry = vAddrModelArry.getOutput();
							x = 0;
							for (x in vAddrModelArry) {
								vAddressModel = vAddrModelArry[x];
								// Save Address Attributes
								addressAttrObjArry = vAddressModel.getAttributes();
								if (addressAttrObjArry != null) {
									addressAttrObjArry = addressAttrObjArry.toArray();
									for (y in addressAttrObjArry) {
										addressAttrObj = addressAttrObjArry[y];
										if (addressAttrObj.getName() == "MilePoint") {
											addressAttrObj.setB1AttributeValue(vMilePoint);
										}
										if (addressAttrObj.getName() == "Highway") {
											addressAttrObj.setB1AttributeValue(vODOTHighwayNumber);
										}
										if (addressAttrObj.getName() == "Side of Hwy") {
											addressAttrObj.setB1AttributeValue(vSideOfHighway);
										}
										if (addressAttrObj.getName() == "District") {
											addressAttrObj.setB1AttributeValue(vDistrict);
										}
									}
								} else {
									aa.print("No address attributes found");
								}
								vSaveResult = aa.address.editAddressWithAPOAttribute(vProjectCapId, vAddressModel);
								aa.print("Address save result: " + vSaveResult.getSuccess());
							}
						}
					}
				}
				
				// Save ASI
				editAppSpecific("City",vCity,vProjectCapId);
				editAppSpecific("State",vState,vProjectCapId);
				editAppSpecific("Zip Code", vZipCode,vProjectCapId);
				editAppSpecific("UPermit Highway",vUpermitHighway,vProjectCapId);
				editAppSpecific("UPermit MilePoint",vUPermitMilePoint,vProjectCapId);
				editAppSpecific("Permit/UPermit",vPermitUpermit,vProjectCapId);
				editAppSpecific("Roadway ID",vRoadwayID,vProjectCapId);
				editAppSpecific("New Highway Number",vNewHighwayNumber,vProjectCapId);
				editAppSpecific("Last Name",vLastName,vProjectCapId);
				editAppSpecific("First Name", vFirstName,vProjectCapId);

				/*
				0 : ODOT HIGHWAY NUMBER
				1 : PERMIT TYPE
				2 : APPLICATION STATUS
				3 : CITY
				4 : STATE
				5 : ZIP CODE
				6 : MILE POINT
				7 : LATITUDE
				8 : LONGITUDE
				9 : UPERMIT HIGHWAY
				10 : UPERMIT MILE POINT
				11 : PERMIT/UPERMIT
				12 : ROADWAY ID
				13 : APPLICATION ID
				14 : SIDE OF HIGHWAY
				15 : NEW HIGHWAY NUMBER
				16 : LAST NAME
				17 : FIRST NAME
				18 : ADDRESS
				19 : PROPERTY CITY
				20 : PROPERTY STATE
				21 : PROPERTY ZIP CODE
				22 : PROPERTY FILE RW
				23 : DISTRICT
				24 : New Application Status
				25 : New Mile Point
				26 : New Approach Width
				27 : New Approach Type
				 */
			}
			// Update import record status
			updateAppStatus("Processed","ODOT_OPAL_IMPORT Complete", capId);
		}
	}
	aa.print("Here in ODOT_OPAL_IMPORT Complete");
}

