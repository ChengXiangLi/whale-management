package org.blade.whale;

public class ExportException extends Exception {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public ExportException(String msg) {
		super(msg);
	}

	public ExportException(Throwable e) {
		super(e);
	}

	public ExportException(String msg, Throwable e) {
		super(msg, e);
	}
}
