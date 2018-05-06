package com.bxs.web.imp;

public class BusinessRule {
    public static void assertTrue(boolean condition, String strError) throws BusinessLogicException {
	if (!condition) {
	    throw new BusinessLogicException(strError);
	}
    }

    public static void assertNotNull(Object condition, String strError) throws BusinessLogicException {
	if (condition == null) {
	    throw new BusinessLogicException(strError);
	}
    }

}
