package com.bxs.web.model;

public class CalculatePrice {

    private String msisdn;
    private float price;

    public CalculatePrice(String msisdn, float price) {
	super();
	this.msisdn = msisdn;
	this.price = price;
    }

    public String getMsisdn() {
	return msisdn;
    }

    public float getPrice() {
	return price;
    }

    public void setMsisdn(String msisdn) {
	this.msisdn = msisdn;
    }

    public void setPrice(float price) {
	this.price = price;
    }

}
