package com.bxs.web.imp;

@SuppressWarnings("serial")
public class BusinessLogicException extends Exception {
    public BusinessLogicException() {
	super();
    }

    public BusinessLogicException(String strError) {
	super(strError);
    }

    public BusinessLogicException(String strError, Throwable throwable) {
	super(strError, throwable);
    }
}
