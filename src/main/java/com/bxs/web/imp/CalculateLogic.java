package com.bxs.web.imp;

import java.math.BigDecimal;
import java.util.Map;
import java.util.TreeMap;
import java.util.concurrent.TimeUnit;

import com.bxs.web.model.UsageList;

public class CalculateLogic {
    private TreeMap<String, Float> map = new TreeMap<String, Float>();
    boolean isStartCal = false;

    public void addCalculateBill(UsageList usage) {
	float tariff = getResult(usage);
	if (map.get(usage.getMsisdn()) != null) {
	    float p = map.get(usage.getMsisdn());
	    map.put(usage.getMsisdn(), p + tariff);
	} else {
	    map.put(usage.getMsisdn(), tariff);
	}
	isStartCal = true;
    }

    private float getResult(UsageList usage) {
	float f = 0f;
	float unitP1 = 1f;
	float unitSecP1 = 1f / 60f;
	switch (usage.getPromotion()) {
	    case "P1":
		long diff = usage.getStopTime().getTime() - usage.getStartTime().getTime();
		if (diff < 0l) {
		    System.out.println(usage.getMsisdn() + " invalid time");
		} else {
		    long seconds = TimeUnit.MILLISECONDS.toSeconds(diff);
		    long minutes = TimeUnit.MILLISECONDS.toMinutes(diff);
		    long remainSec = seconds - (minutes * 60);
		    BigDecimal price = new BigDecimal((unitSecP1 * remainSec) + (unitP1 * minutes));
		    price = price.setScale(2, BigDecimal.ROUND_HALF_UP);
		    f = price.floatValue();
		}
		break;
	    default:
		break;
	}
	return f;
    }

    public Map<String, Float> getPaymentReport() {
	if (isStartCal) {
	    return map;
	} else {
	    return null;
	}
    }

}
