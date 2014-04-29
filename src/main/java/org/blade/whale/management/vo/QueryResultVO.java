package org.blade.whale.management.vo;

import java.io.Serializable;
import java.util.List;

public class QueryResultVO implements Serializable {

	private static final long serialVersionUID = 1L;

	private List<List<String>> data;
	
	public QueryResultVO(List<List<String>> data) {
		this.data = data;
	}

	public List<List<String>> getData() {
		return data;
	}

	public void setData(List<List<String>> data) {
		this.data = data;
	}
}
