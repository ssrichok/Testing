package com.bxs.web.model;

import java.util.Date;

public class UsageList {
    private String date;
    private Date startTime;
    private Date stopTime;
    private String msisdn;
    private String promotion;
    private String filename;

    public String getDate() {
	return date;
    }

    public void setDate(String date) {
	this.date = date;
    }

    public Date getStartTime() {
	return startTime;
    }

    public void setStartTime(Date startTime) {
	this.startTime = startTime;
    }

    public Date getStopTime() {
	return stopTime;
    }

    public void setStopTime(Date stopTime) {
	this.stopTime = stopTime;
    }

    public String getMsisdn() {
	return msisdn;
    }

    public void setMsisdn(String msisdn) {
	this.msisdn = msisdn;
    }

    public String getPromotion() {
	return promotion;
    }

    public void setPromotion(String promotion) {
	this.promotion = promotion;
    }

    public String getFilename() {
	return filename;
    }

    public void setFilename(String filename) {
	this.filename = filename;
    }

}
