package org.blade.whale;

public class ImportException extends Exception {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public ImportException(String msg) {
		super(msg);
	}
	
	public ImportException(Throwable e) {
		super(e);
	}
	
	public ImportException(String msg, Throwable e) {
		super(msg, e);
	}
}
