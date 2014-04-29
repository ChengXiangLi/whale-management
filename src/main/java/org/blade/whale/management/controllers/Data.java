package org.blade.whale.management.controllers;

import java.util.ArrayList;
import java.util.List;

import net.sf.serfj.RestController;
import net.sf.serfj.annotations.GET;
import net.sf.serfj.annotations.POST;

import org.blade.whale.ExportException;
import org.blade.whale.management.service.ActionLog;
import org.blade.whale.management.service.ServiceFactory;
import org.blade.whale.management.vo.FileVO;
import org.blade.whale.management.vo.QueryResultVO;
import org.blade.whale.management.vo.ResultVO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Data extends RestController {
	
	private static Logger logger = LoggerFactory.getLogger(Data.class);

	@POST
	public ResultVO<QueryResultVO> queryData() {
		String tableType = this.getStringParam("tableType");
		String queryFields = this.getStringParam("queryFields");
		String queryCondition = this.getStringParam("queryCondition");
		String userName = this.getStringParam("username");
		ResultVO<QueryResultVO> result = new ResultVO<QueryResultVO>();
		try {
			List<List<String>> data = ServiceFactory.getDataExportService().queryData(tableType, queryFields, queryCondition);
			result.setCode(ResultVO.SUCCESS);
			result.setResult(new QueryResultVO(data));
			ActionLog.insert(userName, "表[" + tableType + "] 查询字段[" + queryFields + "] 查询条件[" + queryCondition + "]");
		} catch (Exception e) {
			result.setCode(ResultVO.FAIL);
			result.setMessage(e.getMessage());
			logger.error("failed to query data:", e);
		}
		return result;
	}
	
	@GET
	public Long queryDataNumber() {
		String tableType = this.getStringParam("tableType");
		String queryFields = this.getStringParam("queryFields");
		String queryCondition = this.getStringParam("queryCondition");
		try {
			return ServiceFactory.getDataExportService().queryDataNumber(tableType, queryFields, queryCondition);
		} catch (ExportException e) {
			logger.error("failed to query data number.", e);
			return 0L;
		}
	}

	@POST
	public ResultVO<String> exportData() {
		String tableType = this.getStringParam("tableType");
		String exportFields = this.getStringParam("exportFields");
		String exportCondition = this.getStringParam("exportCondition");
		String userName = this.getStringParam("username");
		ResultVO<String> result = new ResultVO<String>();
		try {
			String fileName = ServiceFactory.getDataExportService().exportData(tableType, exportFields, exportCondition);
			result.setCode(ResultVO.SUCCESS);
			result.setResult(fileName);
			ActionLog.insert(userName, "表[" + tableType + "] 查询字段[" + exportFields + "] 查询条件[" + exportCondition + "]");
		} catch (Exception e) {
			result.setCode(ResultVO.FAIL);
			result.setMessage(e.getMessage());
			logger.error("failed to export data.", e);
		}
		return result;
	}
	
	@POST
	public ResultVO<String> importFile() {
		String fileName = this.getStringParam("fileName");
		String tableType = this.getStringParam("tableType");
		ResultVO<String> result = new ResultVO<String>();
		try {
			ServiceFactory.getDataImportService().importData(tableType, fileName);
			result.setCode(ResultVO.SUCCESS);
			result.setResult(fileName);
		} catch (Exception e) {
			result.setCode(ResultVO.FAIL);
			result.setMessage(e.getMessage());
			logger.error("failed to import file.", e);
		}
		return result;
	}
	
	@POST
	public ResultVO<String> deleteFile() {
		String fileName = this.getStringParam("fileName");
		String tableType = this.getStringParam("tableType");
		ResultVO<String> result = new ResultVO<String>();
		try {
			ServiceFactory.getDataImportService().deleteFile(tableType, fileName);
			result.setCode(ResultVO.SUCCESS);
			result.setResult(fileName);
		} catch (Exception e) {
			result.setCode(ResultVO.FAIL);
			result.setMessage(e.getMessage());
			logger.error("failed to delete file.", e);
		}
		return result;
	}
	
	@GET
	public List<FileVO> listImportFiles() {
		String tableType = this.getStringParam("tableType");
		List<String> fileNames =  ServiceFactory.getDataImportService().listImportFiles(tableType);
		List<FileVO> fv = new ArrayList<FileVO>();
		if (fileNames != null && !fileNames.isEmpty()) {
			for (String fileName : fileNames) {
				fv.add(new FileVO(fileName));
			}
		}
		return fv;
	}
}
