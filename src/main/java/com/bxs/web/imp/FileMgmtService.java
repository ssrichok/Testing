package com.bxs.web.imp;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLDecoder;
import java.text.SimpleDateFormat;

import com.bxs.web.model.UsageList;

public class FileMgmtService {

    private static String MSISDN_REGEX = "^[0-9]{1,}\\*?|\\*$";
    final public static String DATE_REGEX = "^([0-2][0-9]|(3)[0-1])(\\/)(((0)[0-9])|((1)[0-2]))(\\/)\\d{4}$";
    final public static String TIME_REGEX = "^(?:(?:([01]?\\d|2[0-3]):)?([0-5]?\\d):)?([0-5]?\\d)$";

    // private static String FILEMGMT_DIR_KEY = "/Users/ann_kung/Dev/Telogic/workSpace/bxs/uploadFile";
    private static int DATE = 0;
    private static int START_TIME = 1;
    private static int STOP_TIME = 2;
    private static int MSISDN = 3;
    private static int PROMOTION = 4;

    private final String workingDirecotryPath;

    public FileMgmtService() throws IOException {
	URL classesRootDir = FileMgmtService.class.getProtectionDomain().getCodeSource().getLocation();
	@SuppressWarnings("deprecation")
	String temp = URLDecoder.decode(classesRootDir.toString());
	temp = temp.substring(temp.indexOf("/") + 1, temp.length()); // remove "file:/"
	if (temp.indexOf("classes") > 0) {
	    temp = temp.substring(0, temp.indexOf("classes")) + "classes/";
	}
	String configPath = "/" + temp;
	this.workingDirecotryPath = configPath;
    }

    public boolean checkFileValidFormat(String name, byte[] data) throws Exception {
	BusinessRule.assertTrue(name.matches(getFilenamePattern()), "Invalid file name format.");
	return checkFileValidFormat(data);
    }

    public boolean isFileExists(String filename) {
	return FileUtil.checkFileExists(filename, getWorkingFilePath());
    }

    public boolean checkFileValidFormat(byte[] data) throws Exception {
	ByteArrayInputStream bin = new ByteArrayInputStream(data);
	InputStreamReader in = new InputStreamReader(bin);
	BufferedReader reader = new BufferedReader(in);
	String line = null;
	boolean bValid = false;

	while ((line = reader.readLine()) != null) {
	    SimpleDateFormat format = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
	    String value[] = line.split("[|]");
	    if (value.length == 5) {
		String startTime = value[START_TIME];
		String stopTime = value[STOP_TIME];

		UsageList usageList = new UsageList();
		usageList.setDate(value[DATE]);
		usageList.setStartTime(format.parse(value[DATE] + " " + value[START_TIME]));
		usageList.setStopTime(format.parse(value[DATE] + " " + value[STOP_TIME]));
		usageList.setMsisdn(value[MSISDN]);
		usageList.setPromotion(value[PROMOTION]);

		// check Date
		if (!value[DATE].matches(DATE_REGEX)) {
		    reader.close();
		    return false;
		} else if (!startTime.matches(TIME_REGEX)) {
		    reader.close();
		    return false;
		} else if (!stopTime.matches(TIME_REGEX)) {
		    reader.close();
		    return false;
		} else if (!value[MSISDN].matches(MSISDN_REGEX) || value[MSISDN].length() > 10) {
		    reader.close();
		    return false;
		}
	    } else {
		reader.close();
		return false;
	    }
	}

	bValid = true;
	reader.close();
	return bValid;
    }

    public void addOrUpdateFile(String filename, byte[] data) throws Exception {
	// Step1. Validate file content
	BusinessRule.assertTrue(checkFileValidFormat(data) == true, "Invalid file content format.");

	// Step2. Check file existing
	String[] name = filename.split("_");

	if (name.length == 2) {
	    filename = filename.toUpperCase().replace(".LOG", ".log");
	}

	if (!isFileExists(filename)) {
	    // Step2.1 Save file to working directory if file not exist
	    FileUtil.saveFile(filename, getWorkingFilePath(), data);
	} else {
	    // Step2.2 save new file to working directory
	    FileUtil.saveFile(filename, getWorkingFilePath(), data);
	}
    }

    public void writeFile(String filename, byte[] data) throws Exception {
	if (!isFileExists(filename)) {
	    // Step2.1 Save file to working directory if file not exist
	    FileUtil.saveFile(filename, getWorkingFilePath(), data);
	} else {
	    // Step2.2 save new file to working directory
	    FileUtil.saveFile(filename, getWorkingFilePath(), data);
	}
    }

    public byte[] downloadFile(final String filename) throws Exception {
	String filenames = filename;
	BusinessRule.assertTrue(isFileExists(filenames), "Error file '" + filenames + "' not found");
	return FileUtil.getFileContent(filenames, getWorkingFilePath());
    }

    protected String getFilenamePattern() {
	return "^[a-zA-Z0-9-_\\-]*.log$";
    }

    protected String getWorkingFilePath() {
	return this.workingDirecotryPath;
    }

}
