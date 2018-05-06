package com.bxs.web.model;

import java.util.List;

public class CalculatePriceJson {

    private List<CalculatePrice> calList;

    public CalculatePriceJson(List<CalculatePrice> calList) {
	super();
	this.calList = calList;
    }

    public List<CalculatePrice> getMpList() {
	return calList;
    }

    public void setMpList(List<CalculatePrice> calList) {
	this.calList = calList;
    }
}
