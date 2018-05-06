package com.bxs.web.controller;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Map;
import java.util.Scanner;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.bxs.web.imp.CalculateLogic;
import com.bxs.web.imp.FileMgmtService;
import com.bxs.web.model.CalculatePrice;
import com.bxs.web.model.CalculatePriceJson;
import com.bxs.web.model.UsageList;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;

@Controller
@RequestMapping("/")
public class MobileCalculateController {
    private Logger logger = Logger.getLogger(getClass());
    public static final String DEFAULT_DISPLAY_DATEFORMAT = "dd-MM-yyyy";
    private static final String FILE_JSON_NAME = "result.json";

    private static int DATE = 0;
    private static int START_TIME = 1;
    private static int STOP_TIME = 2;
    private static int MSISDN = 3;
    private static int PROMOTION = 4;

    private void initIndex(ModelMap model, FileMgmtService service) throws Exception {
	UsageList usagelist = new UsageList();
	UsageList usagelistUpload = new UsageList();
	model.addAttribute("usagelist", usagelist);
	model.addAttribute("usagelistUpload", usagelistUpload);
    }

    @RequestMapping(method = RequestMethod.GET)
    public String index(ModelMap model, HttpServletRequest request, HttpServletResponse response) throws Exception {
	FileMgmtService service = new FileMgmtService();
	initIndex(model, service);
	return "calculateMobilePrice";
    }

    // @Validated MultipartFileWrapper file
    @RequestMapping(value = "/multiPartFileSingle", method = RequestMethod.POST)
    @ResponseBody
    public String uploadFile(@RequestParam(required = false) final boolean confirm, ModelMap model, HttpServletRequest request,
	    HttpServletResponse response, @RequestParam("file") MultipartFile file) throws Exception {
	JsonObject jsonObject = new JsonObject();
	FileMgmtService service = new FileMgmtService();
	try {
	    String filename = file.getOriginalFilename().replaceAll("\\s", "");
	    byte[] data;
	    data = file.getBytes();
	    if (service.checkFileValidFormat(data) && service.checkFileValidFormat(filename, data)) {
		service.addOrUpdateFile(filename, data);
		ArrayList<CalculatePrice> calList = writeJsonFile(file, data);
		model.addAttribute("calList", calList);
		jsonObject.addProperty("error_message", "");
		jsonObject.addProperty("file_name", filename);
	    } else {
		jsonObject.addProperty("error_message", "Invalid file content format.");
	    }
	} catch (Exception e) {
	    logger.error("ERROR! ### Mobile File (multiPartFileSingle) ###", e);
	    jsonObject.addProperty("error_message", e.getMessage());
	}

	Gson gson = new GsonBuilder().serializeNulls().setDateFormat(DEFAULT_DISPLAY_DATEFORMAT).create();
	String result = gson.toJson(jsonObject);
	return (result);
    }

    public ArrayList<CalculatePrice> writeJsonFile(@RequestParam("file") MultipartFile file, byte[] data) throws Exception {
	FileMgmtService service = new FileMgmtService();
	CalculateLogic cal = new CalculateLogic();
	ByteArrayInputStream bin = new ByteArrayInputStream(data);
	InputStreamReader in = new InputStreamReader(bin);
	BufferedReader reader = new BufferedReader(in);
	String line = null;
	SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
	ArrayList<CalculatePrice> calList = new ArrayList<CalculatePrice>();

	try {
	    while ((line = reader.readLine()) != null) {
		String value[] = line.split("[|]");
		if (value.length == 5) {
		    UsageList usageList = new UsageList();
		    usageList.setDate(value[DATE]);
		    usageList.setStartTime(sdf.parse(value[DATE] + " " + value[START_TIME]));
		    usageList.setStopTime(sdf.parse(value[DATE] + " " + value[STOP_TIME]));
		    usageList.setMsisdn(value[MSISDN]);
		    usageList.setPromotion(value[PROMOTION]);

		    cal.addCalculateBill(usageList);
		}
	    }

	    Map<String, Float> reportMap = cal.getPaymentReport();
	    for (String m : reportMap.keySet()) {
		calList.add(new CalculatePrice(m, reportMap.get(m)));
	    }

	    CalculatePriceJson json = new CalculatePriceJson(calList);
	    Gson gson = new GsonBuilder().serializeNulls().setDateFormat(DEFAULT_DISPLAY_DATEFORMAT).create();
	    String fileName = file.getOriginalFilename() + "-" + FILE_JSON_NAME;
	    service.writeFile(fileName, gson.toJson(json).getBytes());

	} catch (IOException e) {
	    e.printStackTrace();
	}

	return calList;
    }

    @RequestMapping(method = RequestMethod.POST)
    @ResponseBody
    public String submit(@RequestParam(required = false) final boolean confirm, @RequestParam(required = false) String msg,
	    @ModelAttribute UsageList usagelist, @RequestParam("action") String action, ModelMap model, HttpServletRequest request,
	    HttpServletResponse response) throws Exception {

	JsonObject jsonObject = new JsonObject();
	String fileName = request.getParameter("file_name");

	FileMgmtService service = new FileMgmtService();
	if (action.equals("downloadFile") && fileName != null && !fileName.isEmpty()) {
	    String fileJsonName = fileName + "-" + FILE_JSON_NAME;
	    byte[] outArray = service.downloadFile(fileJsonName);
	    response.setContentType("text/plain");
	    response.setContentLength(outArray.length);
	    response.setHeader("Expires:", "0"); // eliminates browser caching
	    response.setHeader("Content-Disposition", "attachment; filename=" + fileJsonName);
	    OutputStream outStream = response.getOutputStream();
	    outStream.write(outArray);
	    outStream.flush();
	    return null;
	} else {
	    jsonObject.addProperty("error_message", "Can not Download File");
	}

	Gson gson = new GsonBuilder().serializeNulls().setDateFormat(DEFAULT_DISPLAY_DATEFORMAT).create();
	String result = gson.toJson(jsonObject);
	return (result);
    }

    @RequestMapping(value = "/jsonUpload", method = RequestMethod.POST)
    @ResponseBody
    public String handleJsonFileUpload(@RequestParam("jsonfile") MultipartFile file, HttpServletRequest request, HttpServletResponse response) {
	CalculatePriceJson calculatePriceJson = null;
	Gson gson = new GsonBuilder().setPrettyPrinting().create();
	try {
	    StringBuffer stringBuffer = new StringBuffer();
	    Scanner scanner = new Scanner(file.getInputStream());
	    while (scanner.hasNext()) {
		stringBuffer.append(scanner.nextLine());
	    }
	    scanner.close();
	    calculatePriceJson = gson.fromJson(stringBuffer.toString(), CalculatePriceJson.class);
	} catch (IOException e) {
	    e.printStackTrace();
	}
	String result = gson.toJson(calculatePriceJson.getMpList());
	return (result);
    }

}
