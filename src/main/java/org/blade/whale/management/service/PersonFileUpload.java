package org.blade.whale.management.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItemIterator;
import org.apache.commons.fileupload.FileItemStream;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.fileupload.util.Streams;
import org.blade.whale.dataimport.DataImport;
import org.blade.whale.util.PathUtil;

public class PersonFileUpload extends HttpServlet {
	private static final long serialVersionUID = 1L;

	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		boolean isMultipart = ServletFileUpload.isMultipartContent(request);
		if (!isMultipart) {
			throw new ServletException(
					"FileUpload only handle file upload request.");
		}
		// Create a new file upload handler
		ServletFileUpload upload = new ServletFileUpload();
		String tableType = "PERSON";
		// Parse the request
		FileItemIterator iter;
		String fileNames = "";
		String curFileName = "";
		try {
			iter = upload.getItemIterator(request);
			while (iter.hasNext()) {
				FileItemStream item = iter.next();
				String name = item.getFieldName();
				InputStream stream = item.openStream();
				String filename = item.getName();
				curFileName = filename;
				String parentPath = PathUtil.getWebInfPath() + File.separator + DataImport.IMPORT_FILE_BASE_PATH
						+ File.separator + tableType;
				File parent = new File(parentPath);
				if (!parent.exists()) {
					parent.mkdirs();
				}
				File file = new File(parent, filename);
				FileOutputStream outStrem = new FileOutputStream(file);
				if (item.isFormField()) {
					throw new ServletException(
							"FileUpload only handle file upload request.");
				}
				System.out.println("File field " + name + " with file name "
						+ filename + " detected df.");
				Streams.copy(stream, outStrem, true);
//				ServiceFactory.getDataImportService().importData(tableType,
//						filename);
//				file.delete();
				fileNames += " " + filename;
			}
			response.setStatus(HttpServletResponse.SC_OK);
			response.getWriter().append(
					"success upload [" + fileNames + "]").flush();
		} catch (FileUploadException e) {
			String msg = "failed to upload file[" + curFileName +"]\n" + e.getMessage();
			if (!fileNames.endsWith("")) {
				msg = "success upload e[" + fileNames + "]," + msg;
			}
			response.sendError(HttpServletResponse.SC_PRECONDITION_FAILED,
					msg);
		} catch (Exception e) {
			String msg = "failed on file[" + curFileName +"]\n" + e.getMessage();
			if (!fileNames.endsWith("")) {
				msg = "success upload  file[" + fileNames + "]," + msg;
			}
			response.sendError(HttpServletResponse.SC_PRECONDITION_FAILED,
					msg);
		}
	}
}
