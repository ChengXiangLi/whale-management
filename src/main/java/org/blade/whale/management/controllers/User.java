/*
 * Confidential and Proprietary
 * Copyright (C) 2009 whale Corporation
 * All Rights Reserved

 * This software contains the intellectual property of whale Corporation
 * or is licensed to whale Corporation from third parties.  Use of this
 * software and the intellectual property contained therein is expressly
 * limited to the terms and conditions of the License Agreement under which
 * it is provided by or on behalf of whale.
 *
 */
package org.blade.whale.management.controllers;

import java.sql.SQLException;
import java.util.List;

import net.sf.serfj.RestController;
import net.sf.serfj.annotations.GET;
import net.sf.serfj.annotations.POST;

import org.apache.log4j.Logger;
import org.blade.whale.management.service.ActionLog;
import org.blade.whale.management.service.ServiceFactory;
import org.blade.whale.management.vo.ResultVO;
import org.blade.whale.model.UserActionVO;
import org.blade.whale.model.UserVO;

public class User extends RestController {
	protected final Logger logger = Logger.getLogger(this.getClass());

	@POST
	public ResultVO<UserVO> login() {
		String userName = this.getStringParam("username");
		String password = this.getStringParam("password");
		UserVO user = new UserVO(userName, password);
		try {
			boolean isSuperAdmin = ServiceFactory.getUserService().validateUser(
					user);
			user.setSuperAdmin(isSuperAdmin);
		} catch (Exception e) {
			return new ResultVO<UserVO>(ResultVO.FAIL, e.getMessage(), null);
		}
		return new ResultVO<UserVO>(ResultVO.SUCCESS, ResultVO.SUCCESS, user);
	}

	@POST
	public ResultVO<UserVO> createUser() {
		String userName = this.getStringParam("username");
		String password = this.getStringParam("password");
		boolean isSuperAdmin = Boolean.parseBoolean(this
				.getStringParam("issuperadmin"));
		UserVO user = new UserVO(userName, password, isSuperAdmin);
		try {
			ServiceFactory.getUserService().addUser(user);
		} catch (Exception e) {
			return new ResultVO<UserVO>(ResultVO.FAIL, "添加用户失败。\n"
					+ e.getMessage(), null);
		}
		return new ResultVO<UserVO>(ResultVO.SUCCESS, "添加用户成功。", user);
	}

	@POST
	public ResultVO<UserVO> deleteUser() {
		String userName = this.getStringParam("username");
		UserVO user = new UserVO();
		user.setUserName(userName);
		try {
			ServiceFactory.getUserService().deleteUser(user);
		} catch (Exception e) {
			return new ResultVO<UserVO>(ResultVO.FAIL, "添加用户失败。\n"
					+ e.getMessage(), null);
		}
		return new ResultVO<UserVO>(ResultVO.SUCCESS, "添加用户成功。", user);
	}

	@GET
	public List<UserVO> listUsers() {
			try {
				return  ServiceFactory.getUserService().getUsers();
			} catch (SQLException e) {
				e.printStackTrace();
			}
			return null;
	}
	
	@POST
	public List<UserActionVO> listUserActions() {
		String userName = this.getStringParam("username");
		String fromDate = this.getStringParam("fromDate");
		String toDate = this.getStringParam("toDate");
		try {
			return ActionLog.listActions(userName, fromDate, toDate);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return null;
	}
}
