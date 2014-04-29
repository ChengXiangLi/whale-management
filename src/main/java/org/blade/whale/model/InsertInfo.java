package org.blade.whale.model;

import java.util.List;

public class InsertInfo {

	private TableType tableType;
	private List<ColumnInfo> columnInfos;

	public InsertInfo(TableType tableType, List<ColumnInfo> columnInfos) {
		this.tableType = tableType;
		this.columnInfos = columnInfos;
	}

	public TableType getTableType() {
		return tableType;
	}

	public void setTableName(TableType tableType) {
		this.tableType = tableType;
	}

	public List<ColumnInfo> getColumnInfos() {
		return columnInfos;
	}

	public void setColumnInfos(List<ColumnInfo> columnInfos) {
		this.columnInfos = columnInfos;
	}
}
