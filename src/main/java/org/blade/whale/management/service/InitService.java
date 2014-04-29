package org.blade.whale.management.service;

import java.sql.SQLException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;

import org.blade.whale.model.UserVO;
import org.blade.whale.util.DBUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class InitService extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private static final Logger logger = LoggerFactory
			.getLogger(InitService.class);

	@Override
	public void init() throws ServletException {
		super.init();
		initTable();
		initAdmin();
	}

	private void initTable() {
		try {
			DBUtils.executeSqlScript("init.sql");
		} catch (Exception e) {
			logger.warn("Failed to execute init.sql.", e);
		}
	}

	private void initAdmin() {
		try {
			UserService userService = ServiceFactory.getUserService();
			List<UserVO> user = userService.getUsers();
			if (user == null || user.isEmpty()) {
				userService.addUser(new UserVO("admin", "admin", true));
			}
		} catch (SQLException e) {
			logger.warn("Failed to init admin.", e);
		}
	}
}
