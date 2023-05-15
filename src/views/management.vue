<template>
    <div class="management">
        <div
            style="
                padding: 8px 16px;
                box-sizing: border-box;
                border-bottom: 1px solid #ebebeb;
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
            <div>
                <el-button type="primary" size="small" @click="dialogFormVisible = true"
                    >新增项目</el-button
                >
                <el-button size="small" plain>回第一步</el-button>
            </div>
            <el-radio-group
                v-model="wlistRadio"
                @input="
                    () => {
                        getCreateProjectList()
                        tableDataPage = 0
                        tableDataSize = 10
                    }
                ">
                <el-radio :label="0">所有</el-radio>
                <el-radio :label="1">编辑中</el-radio>
                <el-radio :label="2">待审核</el-radio>
                <el-radio :label="3">审核通过</el-radio>
                <el-radio :label="4">审核不通过</el-radio>
            </el-radio-group>
        </div>
        <div style="display: flex; justify-content: center; padding: 16px; gap: 60px">
            <div style="display: flex; align-items: center; width: 38%">
                <span style="font-size: 14px; color: #5c5c5c; white-space: nowrap"
                    >标段(包)编号：
                </span>
                <el-input v-model="inputCode" size="small" style="max-width: 250px"></el-input>
            </div>
            <div style="display: flex; align-items: center; width: 38%">
                <span style="font-size: 14px; color: #5c5c5c; white-space: nowrap"
                    >标段(包)名称：
                </span>
                <el-input v-model="inputName" size="small"></el-input>
            </div>
            <el-button
                type="primary"
                icon="el-icon-search"
                size="small"
                style="padding: 0 8px"
                @click="
                    () => {
                        getCreateProjectList()
                        tableDataPage = 0
                        tableDataSize = 10
                    }
                "
                >搜索</el-button
            >
        </div>
        <!-- 列表内容 ======================================= -->
        <div
            style="
                width: calc(100vw - 181px);
                height: calc(100% - 160px);
                position: relative;
                padding: 8px 12px;
                box-sizing: border-box;
            ">
            <el-table
                ref="multipleTable"
                :data="tableData"
                :header-cell-style="{ background: '#FAFAFA' }"
                size="small"
                width="100%"
                height="100%"
                style="width: 100%">
                <template slot="empty">
                    <img style="margin-top: 40px" src="@/assets/images/nodata.png" alt="" />
                    <p>没有数据</p>
                </template>
                <el-table-column type="selection" width="45"> </el-table-column>
                <el-table-column label="序" width="56">
                    <template slot-scope="scope">{{ scope.$index + 1 }}</template>
                </el-table-column>
                <el-table-column prop="xmid" label="标段(包)编号" width="220"> </el-table-column>
                <el-table-column prop="xmname" label="标段(包)名称" width="160"> </el-table-column>
                <el-table-column prop="xm_dq" label="项目地区"> </el-table-column>
                <el-table-column prop="xm_dq" label="评标地点" width="90">
                    <template slot-scope="scope">评标室 {{ scope.row.xm_pbdd_id }} </template>
                </el-table-column>
                <el-table-column prop="xm_pb_time" label="评标时间" width="180"> </el-table-column>
                <el-table-column label="项目状态">
                    <template slot-scope="scope"> 未抽取 </template>
                </el-table-column>
                <el-table-column label="审核状态">
                    <template slot-scope="scope">
                        {{ scope.row.createstates == 0 ? '编辑中' : '待审核' }}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <i
                            class="el-icon-edit"
                            style="color: #2590eb; cursor: pointer"
                            @click="
                                () => {
                                    formLabelAlign = scope.row
                                    dialogFormVisible = true
                                    getZhuanyeList()
                                    pingweiPopOpen() // 评委
                                }
                            "></i>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div
            style="
                height: 50px;
                background-color: #fff;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                position: fixed;
                right: 0;
                bottom: 0;
            ">
            <el-pagination
                background
                layout="prev, pager, sizes, jumper, total"
                :page-size="this.tableDataSize"
                :total="tableDataTotal"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange">
            </el-pagination>
        </div>
        <!-- 新增弹窗 ======================================= -->
        <el-dialog
            class="add-object"
            title="新增项目信息"
            :visible.sync="dialogFormVisible"
            @close="dialogFormVisibleHandleClose">
            <div style="padding: 8px 16px; border-bottom: 1px solid #ebebeb">
                <el-button type="primary" size="small" @click="addProject(1)">修改保存</el-button>
                <el-button size="small" plain @click="addProject(2)">提交信息</el-button>
            </div>
            <el-dialog
                class="tipsPop"
                width="30%"
                title="提示"
                :visible.sync="tipsPop"
                append-to-body>
                <p>保存成功!</p>
                <div style="margin-top: 10px; display: flex; justify-content: flex-end">
                    <el-button type="primary" size="small" @click="tipsPop = false">确定</el-button>
                </div>
            </el-dialog>
            <el-dialog
                class="tipsPop"
                width="90%"
                title="请输入意见"
                :visible.sync="createstatese1Pop"
                append-to-body>
                <p style="display: flex; align-items: center; color: #2590eb">
                    <i
                        style="
                            width: 6px;
                            height: 16px;
                            background-color: #2590eb;
                            display: block;
                            margin-right: 5px;
                        "></i>
                    签署意见
                </p>
                <div
                    style="
                        display: flex;
                        border: 1px solid #e4e7ed;
                        height: 469px;
                        margin-top: 10px;
                        border-radius: 4px;
                    ">
                    <div style="width: 50%; border-right: 1px solid #e4e7ed">
                        <textarea
                            style="
                                width: 100%;
                                height: 100%;
                                padding: 10px;
                                box-sizing: border-box;
                                border: none;
                                outline: none;
                                resize: none;
                            "></textarea>
                    </div>
                    <div style="width: 50%; display: flex">
                        <div style="padding: 8px 16px; color: #2590eb">公共意见模版</div>
                        <div style="padding: 8px 16px">我的意见模版</div>
                    </div>
                </div>
                <div
                    style="
                        margin-top: 10px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    ">
                    <div style="font-size: 12px; color: #999">
                        当前步骤：提交备案 当前操作：提交信息
                    </div>
                    <div>
                        <el-button
                            type="primary"
                            size="small"
                            style="margin-right: 10px"
                            @click="
                                () => {
                                    chulichenggongPop = true
                                }
                            "
                            >确定提交</el-button
                        >
                        <el-dialog
                            class="tipsPop"
                            width="30%"
                            title="提示"
                            :visible.sync="chulichenggongPop"
                            append-to-body
                            @cloce="
                                () => {
                                    tipsPop = false
                                    createstatese1Pop = false
                                    chulichenggongPop = false
                                    dialogFormVisible = false
                                }
                            ">
                            <p>处理成功!</p>
                            <div style="margin-top: 10px; display: flex; justify-content: flex-end">
                                <el-button
                                    type="primary"
                                    size="small"
                                    @click="
                                        () => {
                                            tipsPop = false
                                            createstatese1Pop = false
                                            chulichenggongPop = false
                                            dialogFormVisible = false
                                        }
                                    "
                                    >确定</el-button
                                >
                            </div>
                        </el-dialog>
                        <el-button
                            plain
                            size="small"
                            @click="
                                () => {
                                    createstatese1Pop = false
                                }
                            "
                            >取消</el-button
                        >
                    </div>
                </div>
            </el-dialog>
            <el-tabs
                v-model="activeName"
                type="card"
                style="
                    width: 95%;
                    height: calc(100% - 100px);
                    margin: auto;
                    margin-top: 18px;
                    overflow-y: auto;
                ">
                <!-- 必填信息 ======================================= -->
                <el-tab-pane label="必填信息" name="1">
                    <div
                        style="
                            border: 1px solid #e4e7ed;
                            border-top: none;
                            border-radius: 0 0 4px 4px;
                            padding: 10px;
                            overflow: auto;
                        ">
                        <el-collapse v-model="activeNames">
                            <el-collapse-item name="1">
                                <template slot="title">
                                    <p style="color: #2590eb">01 项目通知信息</p>
                                </template>
                                <el-form
                                    style="margin-top: 16px"
                                    label-position="right"
                                    label-width="140px"
                                    :model="formLabelAlign">
                                    <el-form-item label="标段(包)编号：" must>
                                        <el-input
                                            :disabled="xuanzexiangmuPopYes"
                                            v-model="formLabelAlign.xmid"
                                            size="small"></el-input>
                                    </el-form-item>
                                    <el-form-item label="标段(包)名称：" must>
                                        <div style="position: relative">
                                            <el-input
                                                :disabled="xuanzexiangmuPopYes"
                                                v-model="formLabelAlign.xmname"
                                                size="small"></el-input>
                                            <i
                                                v-if="!xuanzexiangmuPopYes"
                                                @click="formLabelAlign.xmname = ''"
                                                class="input-left-icon el-icon-close input-clone"></i>
                                            <i
                                                v-if="!xuanzexiangmuPopYes"
                                                @click="xuanzexiangmuPop = true"
                                                class="input-left-icon2 el-icon-more"></i>
                                        </div>
                                    </el-form-item>
                                    <!-- 选择项目内层弹窗======================================= -->
                                    <el-dialog
                                        class="xuanzexiangmuPop"
                                        title="选择项目"
                                        :visible.sync="xuanzexiangmuPop"
                                        @close="
                                            () => {
                                                radiowaicheng = ''
                                            }
                                        "
                                        append-to-body>
                                        <div
                                            style="
                                                height: 100%;
                                                display: flex;
                                                flex-direction: column;
                                            ">
                                            <div
                                                style="
                                                    display: flex;
                                                    justify-content: center;
                                                    padding: 16px;
                                                    gap: 50px;
                                                ">
                                                <div style="display: flex; align-items: center">
                                                    <span
                                                        style="
                                                            font-size: 14px;
                                                            color: #5c5c5c;
                                                            white-space: nowrap;
                                                        "
                                                        >标段(包)编号：</span
                                                    >
                                                    <el-input
                                                        v-model="inputCode"
                                                        size="small"></el-input>
                                                </div>
                                                <div style="display: flex; align-items: center">
                                                    <span
                                                        style="
                                                            font-size: 14px;
                                                            color: #5c5c5c;
                                                            white-space: nowrap;
                                                        "
                                                        >项目名称：</span
                                                    >
                                                    <el-input
                                                        v-model="inputCode"
                                                        size="small"></el-input>
                                                </div>
                                                <div style="display: flex; align-items: center">
                                                    <span
                                                        style="
                                                            font-size: 14px;
                                                            color: #5c5c5c;
                                                            white-space: nowrap;
                                                        "
                                                        >场地类型：
                                                    </span>
                                                    <el-select
                                                        v-model="formLabelAlign.value"
                                                        placeholder=""
                                                        size="small">
                                                        <el-option label="全部" :value="1">
                                                        </el-option>
                                                        <el-option label="资审场地安排" :value="2">
                                                        </el-option>
                                                        <el-option label="开评场地安排" :value="3">
                                                        </el-option>
                                                    </el-select>
                                                </div>
                                                <el-button
                                                    type="primary"
                                                    icon="el-icon-search"
                                                    size="small"
                                                    style="padding: 0 8px"
                                                    >搜索</el-button
                                                >
                                            </div>
                                            <div
                                                style="
                                                    height: 80%;
                                                    padding: 0 20px;
                                                    box-sizing: border-box;
                                                ">
                                                <el-table
                                                    :data="slaketTableData"
                                                    :header-cell-style="{ background: '#FAFAFA' }"
                                                    size="small"
                                                    style="
                                                        width: 100%;
                                                        height: 100%;
                                                        overflow: auto;
                                                    ">
                                                    <el-table-column
                                                        label=""
                                                        align="center"
                                                        width="65">
                                                        <template scope="scope">
                                                            <el-radio
                                                                :label="scope.$index"
                                                                v-model="radiowaicheng"
                                                                @change.native="
                                                                    () => {
                                                                        // 暂存数据
                                                                        thisRow = scope.row
                                                                    }
                                                                "></el-radio>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column label="序" width="56">
                                                        <template slot-scope="scope">{{
                                                            scope.$index + 1
                                                        }}</template>
                                                    </el-table-column>
                                                    <el-table-column
                                                        prop="xmid"
                                                        label="标段(包)编号"
                                                        width="220">
                                                    </el-table-column>
                                                    <el-table-column
                                                        prop="xmname"
                                                        label="项目名称"
                                                        width="160">
                                                    </el-table-column>
                                                    <el-table-column
                                                        prop="xm_pb_time"
                                                        label="开标时间"
                                                        sortable>
                                                    </el-table-column>
                                                    <el-table-column
                                                        prop="xm_dq"
                                                        label="开标室"
                                                        width="90">
                                                        <template slot-scope="scope"
                                                            >开标室 {{ scope.row.xm_pbdd_id }}
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column
                                                        prop="xm_dq"
                                                        label="评标室"
                                                        width="90">
                                                        <template slot-scope="scope"
                                                            >评标室 {{ scope.row.xm_pbdd_id }}
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column
                                                        prop="name"
                                                        width="56"
                                                        label="选择">
                                                        <template slot-scope="scope">
                                                            <i
                                                                @click="selectItem(scope.row)"
                                                                class="el-icon-circle-plus-outline"
                                                                style="
                                                                    font-size: 18px;
                                                                    color: #2590eb;
                                                                    cursor: pointer;
                                                                "></i>
                                                        </template>
                                                    </el-table-column>
                                                </el-table>
                                            </div>
                                            <div
                                                style="
                                                    display: flex;
                                                    justify-content: flex-end;
                                                    margin-top: 10px;
                                                ">
                                                <el-pagination
                                                    background
                                                    layout="prev, pager, sizes, jumper, total"
                                                    :total="400">
                                                </el-pagination>
                                            </div>
                                            <div
                                                style="
                                                    display: flex;
                                                    justify-content: center;
                                                    margin-top: 20px;
                                                ">
                                                <el-button
                                                    type="primary"
                                                    size="small"
                                                    @click="
                                                        () => {
                                                            formLabelAlign.xmid = thisRow.xmid
                                                            formLabelAlign.xmname = thisRow.xmname
                                                            formLabelAlign.xm_zbr = thisRow.xm_zbr
                                                            formLabelAlign.xm_dljg = thisRow.xm_dljg
                                                            formLabelAlign.xm_pbdd_id =
                                                                thisRow.xm_pbdd_id
                                                            this.xuanzexiangmuPop = false
                                                            this.xuanzexiangmuPopYes = true
                                                        }
                                                    "
                                                    >确认选择</el-button
                                                >
                                            </div>
                                        </div>
                                    </el-dialog>
                                    <el-form-item label="招标人：">
                                        <div style="position: relative">
                                            <el-input
                                                :disabled="xuanzexiangmuPopYes"
                                                v-model="formLabelAlign.xm_zbr"
                                                size="small"></el-input>
                                            <i
                                                v-if="!xuanzexiangmuPopYes"
                                                @click="formLabelAlign.xm_zbr = ''"
                                                class="input-left-icon el-icon-close input-clone"></i>
                                            <i
                                                v-if="!xuanzexiangmuPopYes"
                                                @click="
                                                    () => {
                                                        zhaobiaorenPop = true
                                                        zhaobiaorenIsOne = 1
                                                    }
                                                "
                                                class="input-left-icon2 el-icon-more"></i>
                                        </div>
                                    </el-form-item>
                                    <el-form-item label="代理机构：">
                                        <div style="position: relative">
                                            <el-input
                                                :disabled="xuanzexiangmuPopYes"
                                                v-model="formLabelAlign.xm_dljg"
                                                size="small"></el-input>
                                            <i
                                                v-if="!xuanzexiangmuPopYes"
                                                @click="formLabelAlign.xm_dljg = ''"
                                                class="input-left-icon el-icon-close input-clone"></i>
                                            <i
                                                v-if="!xuanzexiangmuPopYes"
                                                @click="
                                                    () => {
                                                        zhaobiaorenPop = true
                                                        zhaobiaorenIsOne = 2
                                                    }
                                                "
                                                class="input-left-icon2 el-icon-more"></i>
                                        </div>
                                    </el-form-item>
                                    <!-- 选择单位 内层弹窗2=========== -->
                                    <el-dialog
                                        class="xuanzexiangmuPop xuanzedanwei"
                                        title="选择单位"
                                        :visible.sync="zhaobiaorenPop"
                                        @open="zhaobiaorenPopOpen"
                                        @close="
                                            () => {
                                                // 关闭弹窗
                                                radio = ''
                                            }
                                        "
                                        append-to-body>
                                        <div
                                            style="
                                                height: 100%;
                                                display: flex;
                                                flex-direction: column;
                                            ">
                                            <div
                                                style="
                                                    display: flex;
                                                    justify-content: center;
                                                    padding: 16px;
                                                ">
                                                <div
                                                    style="
                                                        display: flex;
                                                        align-items: center;
                                                        margin-left: 50px;
                                                    ">
                                                    <span
                                                        style="
                                                            font-size: 14px;
                                                            color: #5c5c5c;
                                                            white-space: nowrap;
                                                        "
                                                        >单位名称：</span
                                                    >
                                                    <el-input
                                                        v-model="inputCode"
                                                        size="small"></el-input>
                                                </div>
                                                <div
                                                    style="
                                                        display: flex;
                                                        align-items: center;
                                                        margin-left: 50px;
                                                    ">
                                                    <span
                                                        style="
                                                            font-size: 14px;
                                                            color: #5c5c5c;
                                                            white-space: nowrap;
                                                        "
                                                        >辖区：
                                                    </span>
                                                    <el-select
                                                        v-model="formLabelAlign.value"
                                                        placeholder=""
                                                        size="small">
                                                        <el-option label="所有" :value="1">
                                                        </el-option>
                                                        <el-option
                                                            label="新疆维吾尔自治区"
                                                            :value="2">
                                                        </el-option>
                                                        <el-option label="和田地区" :value="3">
                                                        </el-option>
                                                        <el-option label="和田市" :value="4">
                                                        </el-option>
                                                    </el-select>
                                                </div>
                                                <el-button
                                                    type="primary"
                                                    icon="el-icon-search"
                                                    size="small"
                                                    style="padding: 0 8px"
                                                    >搜索</el-button
                                                >
                                            </div>
                                            <div style="padding: 0 20px; flex: 1">
                                                <el-table
                                                    :data="zhaobiaorenPopList"
                                                    :header-cell-style="{ background: '#FAFAFA' }"
                                                    size="small"
                                                    style="width: 100%">
                                                    <el-table-column
                                                        label=""
                                                        align="center"
                                                        width="65">
                                                        <template scope="scope">
                                                            <el-radio
                                                                :label="scope.$index"
                                                                v-model="radio"
                                                                @change.native="
                                                                    () => {
                                                                        danweiZancun =
                                                                            scope.row.name
                                                                    }
                                                                "></el-radio>
                                                        </template>
                                                    </el-table-column>
                                                    <el-table-column label="序" width="56">
                                                        <template slot-scope="scope">{{
                                                            scope.$index + 1
                                                        }}</template>
                                                    </el-table-column>
                                                    <el-table-column
                                                        prop="name"
                                                        width="240"
                                                        label="单位名称">
                                                    </el-table-column>
                                                    <el-table-column
                                                        prop="leixing"
                                                        label="单位类型">
                                                    </el-table-column>
                                                    <el-table-column prop="proid" label="辖区">
                                                    </el-table-column>
                                                    <el-table-column
                                                        prop="name"
                                                        width="56"
                                                        label="选择">
                                                        <template slot-scope="scope">
                                                            <i
                                                                class="el-icon-circle-plus-outline"
                                                                @click="
                                                                    () => {
                                                                        getCurrentRow2(scope.row)
                                                                        zhaobiaorenPop = false
                                                                    }
                                                                "
                                                                style="
                                                                    font-size: 18px;
                                                                    color: #2590eb;
                                                                    cursor: pointer;
                                                                "></i>
                                                        </template>
                                                    </el-table-column>
                                                </el-table>
                                            </div>
                                            <div style="display: flex; justify-content: flex-end">
                                                <el-pagination
                                                    background
                                                    layout="prev, sizes, jumper, total"
                                                    :total="400">
                                                </el-pagination>
                                            </div>
                                            <div
                                                style="
                                                    display: flex;
                                                    justify-content: center;
                                                    margin-top: 20px;
                                                ">
                                                <el-button
                                                    type="primary"
                                                    size="small"
                                                    @click="
                                                        () => {
                                                            if (zhaobiaorenIsOne == 1) {
                                                                formLabelAlign.xm_zbr = danweiZancun
                                                            } else {
                                                                formLabelAlign.xm_dljg =
                                                                    danweiZancun
                                                            }
                                                            zhaobiaorenPop = false
                                                        }
                                                    "
                                                    >确认选择</el-button
                                                >
                                            </div>
                                        </div>
                                    </el-dialog>
                                    <div style="display: flex; justify-content: space-between">
                                        <el-form-item label="评标耗时：" must style="width: 50%">
                                            <el-select
                                                v-model="formLabelAlign.xm_pbhs"
                                                placeholder=""
                                                size="small"
                                                style="width: 100%">
                                                <el-option label="半天" :value="1"> </el-option>
                                                <el-option label="半天或一天" :value="2">
                                                </el-option>
                                                <el-option label="一天" :value="3"> </el-option>
                                                <el-option label="一天或两天" :value="4">
                                                </el-option>
                                                <el-option label="两天" :value="5"> </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="评标地点：" must style="width: 50%">
                                            <el-select
                                                v-model="formLabelAlign.xm_pbdd_id"
                                                placeholder=""
                                                size="small"
                                                style="width: 100%">
                                                <el-option
                                                    v-for="item in 16"
                                                    :label="`评标室${item}`"
                                                    :value="item">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                    <el-form-item label="评标时间：" must>
                                        <el-date-picker
                                            v-model="formLabelAlign.xm_pb_time_day"
                                            align="right"
                                            type="date"
                                            placeholder="选择日期"
                                            :picker-options="pickerOptions"
                                            size="small"
                                            style="width: 150px">
                                        </el-date-picker>
                                        <el-select
                                            v-model="formLabelAlign.xm_pb_time_h"
                                            placeholder=""
                                            size="small"
                                            style="width: 70px; margin: 0 8px">
                                            <el-option
                                                v-for="(item, index) in 23"
                                                :label="index"
                                                :value="index">
                                            </el-option>
                                        </el-select>
                                        <span>时</span>
                                        <el-select
                                            v-model="formLabelAlign.xm_pb_time_d"
                                            placeholder=""
                                            size="small"
                                            style="width: 70px; margin: 0 8px">
                                            <el-option label="00" :value="0"> </el-option>
                                            <el-option label="05" :value="5"> </el-option>
                                            <el-option label="10" :value="10"> </el-option>
                                            <el-option label="15" :value="15"> </el-option>
                                            <el-option label="20" :value="20"> </el-option>
                                            <el-option label="25" :value="25"> </el-option>
                                            <el-option label="30" :value="30"> </el-option>
                                            <el-option label="35" :value="35"> </el-option>
                                            <el-option label="40" :value="40"> </el-option>
                                            <el-option label="45" :value="45"> </el-option>
                                            <el-option label="50" :value="50"> </el-option>
                                            <el-option label="55" :value="55"> </el-option>
                                        </el-select>
                                        <span>分</span>
                                    </el-form-item>
                                    <el-form-item label="评委签到时间：" must>
                                        <el-date-picker
                                            v-model="formLabelAlign.xm_pwqd_time_day"
                                            align="right"
                                            type="date"
                                            placeholder="选择日期"
                                            :picker-options="pickerOptions"
                                            size="small"
                                            style="width: 150px">
                                        </el-date-picker>
                                        <el-select
                                            v-model="formLabelAlign.xm_pwqd_time_h"
                                            placeholder=""
                                            size="small"
                                            style="width: 70px; margin: 0 8px">
                                            <el-option
                                                v-for="(item, index) in 23"
                                                :label="index"
                                                :value="index">
                                            </el-option>
                                        </el-select>
                                        <span>时</span>
                                        <el-select
                                            v-model="formLabelAlign.xm_pwqd_time_d"
                                            placeholder=""
                                            size="small"
                                            style="width: 70px; margin: 0 8px">
                                            <el-option label="00" :value="0"> </el-option>
                                            <el-option label="05" :value="5"> </el-option>
                                            <el-option label="10" :value="10"> </el-option>
                                            <el-option label="15" :value="15"> </el-option>
                                            <el-option label="20" :value="20"> </el-option>
                                            <el-option label="25" :value="25"> </el-option>
                                            <el-option label="30" :value="30"> </el-option>
                                            <el-option label="35" :value="35"> </el-option>
                                            <el-option label="40" :value="40"> </el-option>
                                            <el-option label="45" :value="45"> </el-option>
                                            <el-option label="50" :value="50"> </el-option>
                                            <el-option label="55" :value="55"> </el-option>
                                        </el-select>
                                        <span>分</span>
                                    </el-form-item>
                                </el-form>
                            </el-collapse-item>
                            <el-collapse-item title="反馈 Feedback" name="2">
                                <template slot="title">
                                    <p style="color: #2590eb">02 抽取信息</p>
                                </template>
                                <el-form
                                    style="margin-top: 16px"
                                    label-position="right"
                                    label-width="140px"
                                    :model="formLabelAlign">
                                    <el-form-item label="抽取回避：">
                                        <el-input
                                            v-model="formLabelAlign.day_1"
                                            style="width: 68px"
                                            size="small"></el-input>
                                        天内参加过评标的评委不再抽取； 一个月内参加过
                                        <el-input
                                            v-model="formLabelAlign.day_2"
                                            style="width: 68px"
                                            size="small"></el-input>
                                        次评标的评委不再抽取；
                                    </el-form-item>
                                    <el-form-item label="">
                                        <span style="color: red"
                                            >参加过资审评标的评委不再抽取。</span
                                        >
                                    </el-form-item>
                                    <el-form-item label="备注：">
                                        <el-input
                                            type="textarea"
                                            :rows="2"
                                            placeholder=""
                                            v-model="formLabelAlign.textarea">
                                        </el-input>
                                    </el-form-item>
                                </el-form>
                            </el-collapse-item>
                            <el-collapse-item name="3">
                                <template slot="title">
                                    <p style="color: #2590eb">03 相关电子件</p>
                                </template>
                                <el-table
                                    :data="[{ title: '1' }]"
                                    :header-cell-style="{ background: '#FAFAFA' }"
                                    size="small"
                                    style="width: 100%">
                                    <el-table-column label="电子件名称" width="200">
                                        <template slot-scope="scope">
                                            <div style="display: flex; align-items: center">
                                                <el-tooltip
                                                    class="item"
                                                    effect="dark"
                                                    content="招标人代表授权委托书"
                                                    placement="bottom">
                                                    <img
                                                        style="width: 16px; margin-right: 5px"
                                                        src="@/assets/images/icon-information.png"
                                                        alt="" />
                                                </el-tooltip>
                                                招标人代表授权委托书
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="name" label="电子件列表" width="300">
                                        <template slot-scope="scope">
                                            <div style="display: flex; align-items: center">
                                                无电子件
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="name" label="电子件管理">
                                        <template slot-scope="scope">
                                            <div style="display: flex; align-items: center">
                                                <img
                                                    style="width: 16px; margin-right: 5px"
                                                    src="@/assets/images/icon-information.png"
                                                    alt="" />
                                                上传
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="name" label="备注">
                                        <template slot-scope="scope">
                                            <el-input
                                                :rows="2"
                                                placeholder=""
                                                size="small"
                                                v-model="formLabelAlign.textarea">
                                            </el-input>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="name" label="模板下载">
                                        <template slot-scope="scope">
                                            <span>暂无模板</span>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-collapse-item>
                            <el-collapse-item name="4">
                                <template slot="title">
                                    <p style="color: #2590eb">04 处理历史</p>
                                </template>
                                <el-table
                                    :data="[{}]"
                                    tooltip-effect="dark"
                                    :header-cell-style="{ background: '#FAFAFA' }"
                                    size="small"
                                    style="width: 100%">
                                    <el-table-column label="步骤"> </el-table-column>
                                    <el-table-column prop="name" label="办理人员">
                                    </el-table-column>
                                    <el-table-column prop="name" label="收到时间">
                                    </el-table-column>
                                    <el-table-column prop="name" label="处理时间">
                                    </el-table-column>
                                    <el-table-column prop="name" label="处理意见" width="400">
                                    </el-table-column>
                                </el-table>
                            </el-collapse-item>
                        </el-collapse>
                    </div>
                </el-tab-pane>
                <!-- 评标委员会 ======================================= -->
                <el-tab-pane label="评标委员会" name="2">
                    <div
                        style="
                            border: 1px solid #e4e7ed;
                            border-top: none;
                            border-radius: 0 0 4px 4px;
                            padding: 10px;
                        ">
                        <el-collapse v-model="activeNames">
                            <el-collapse-item name="5">
                                <template slot="title">
                                    <p style="color: #2590eb">05 专业信息</p>
                                </template>
                                <div style="padding: 10px">
                                    <el-button size="small" plain @click="addDiscipline"
                                        >添加专业</el-button
                                    >
                                    <el-button
                                        size="small"
                                        plain
                                        @click="
                                            () => {
                                                if (yixuanzhuanyeDetail.length == 0) {
                                                    $message({
                                                        message: '请选择要删除的记录!',
                                                        type: 'error'
                                                    })
                                                    return
                                                }
                                                qierenshanchu = true
                                            }
                                        "
                                        >删除专业</el-button
                                    >
                                    <el-dialog
                                        class="tipsPop"
                                        width="30%"
                                        title="确认"
                                        :visible.sync="qierenshanchu"
                                        append-to-body>
                                        <p>您确认要删除选中的专业吗？</p>
                                        <div
                                            style="
                                                margin-top: 10px;
                                                display: flex;
                                                justify-content: flex-end;
                                            ">
                                            <el-button
                                                type="primary"
                                                size="small"
                                                @click="
                                                    () => {
                                                        deleteMajor()
                                                        qierenshanchu = false
                                                    }
                                                "
                                                >确定</el-button
                                            >
                                            <el-button
                                                size="small"
                                                plain
                                                @click="qierenshanchu = false"
                                                >取消</el-button
                                            >
                                        </div>
                                    </el-dialog>
                                    <el-dialog
                                        class="xuanzexiangmuPop xuanzedanwei"
                                        title="设置专业信息"
                                        :visible.sync="zhuanyexinxiPop"
                                        @open="zhaobiaorenPopOpen"
                                        @close="yixuanzhuanyeThis = []"
                                        append-to-body>
                                        <div style="padding: 10px">
                                            <el-button
                                                type="primary"
                                                size="small"
                                                @click="
                                                    () => {
                                                        isAddDiscipline()
                                                        zhuanyexinxiPop = false
                                                    }
                                                "
                                                >确认选择</el-button
                                            >
                                            <el-button
                                                size="small"
                                                plain
                                                @click="
                                                    () => {
                                                        yixuanzhuanye = []
                                                        zhuanyexinxiPop = false
                                                    }
                                                "
                                                >取消选择</el-button
                                            >
                                            <div
                                                style="
                                                    width: 100%;
                                                    height: 1px;
                                                    background-color: #ebebeb;
                                                    margin: 10px 0;
                                                "></div>
                                            <div style="display: flex; align-items: center">
                                                <span
                                                    style="
                                                        font-size: 14px;
                                                        color: #5c5c5c;
                                                        white-space: nowrap;
                                                    "
                                                    >辖区：
                                                </span>
                                                <el-select :value="1" placeholder="" size="small">
                                                    <el-option label="和田地区" :value="1">
                                                    </el-option>
                                                </el-select>
                                            </div>
                                            <div style="display: flex; gap: 10px; margin-top: 10px">
                                                <div
                                                    style="
                                                        height: 359px;
                                                        flex: 1;
                                                        border: 1px solid #ebebeb;
                                                        border-radius: 6px;
                                                        padding: 10px;
                                                        box-sizing: border-box;
                                                    ">
                                                    <span style="color: #2590eb"
                                                        >请从下面专业树中选择</span
                                                    >
                                                    <el-tree
                                                        style="margin-top: 10px"
                                                        show-checkbox
                                                        :data="treeData"
                                                        :check-strictly="true"
                                                        @check-change="handleCheckChange"></el-tree>
                                                </div>
                                                <div
                                                    style="
                                                        height: 359px;
                                                        flex: 1;
                                                        border: 1px solid #ebebeb;
                                                        border-radius: 6px;
                                                        padding: 10px;
                                                        box-sizing: border-box;
                                                    ">
                                                    <span style="color: #2590eb">已挑选专业</span>
                                                    <div
                                                        style="
                                                            width: 100%;
                                                            height: 1px;
                                                            background-color: #ebebeb;
                                                            margin: 10px 0;
                                                        "></div>
                                                    <div
                                                        style="
                                                            padding: 0 10px;
                                                            box-sizing: border-box;
                                                        ">
                                                        <div
                                                            v-for="item in yixuanzhuanyeThis"
                                                            style="margin-top: 5px">
                                                            {{ item.name }}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </el-dialog>
                                    <el-table
                                        :data="yixuanzhuanye"
                                        tooltip-effect="dark"
                                        :header-cell-style="{ background: '#FAFAFA' }"
                                        size="small"
                                        style="width: 100%"
                                        @selection-change="sliectDeleteMajor">
                                        <el-table-column type="selection" width="45">
                                        </el-table-column>
                                        <el-table-column label="序" width="56">
                                            <template slot-scope="scope">{{
                                                scope.$index + 1
                                            }}</template>
                                        </el-table-column>
                                        <el-table-column prop="name" label="评标专业">
                                        </el-table-column>
                                        <el-table-column label="抽取类别">
                                            <template slot-scope="scope">本地抽取</template>
                                        </el-table-column>
                                        <el-table-column prop="name" label="抽取设置">
                                            <template slot-scope="scope">--</template>
                                        </el-table-column>
                                        <el-table-column prop="name" label="满足条件人数">
                                            <template slot-scope="scope">0</template>
                                        </el-table-column>
                                        <el-table-column prop="name" label="所需人数">
                                            <template slot-scope="scope">0</template>
                                        </el-table-column>
                                        <el-table-column prop="name" label="需抽人数">
                                            <template slot-scope="scope">0</template>
                                        </el-table-column>
                                        <el-table-column prop="name" label="已抽取人数">
                                            <template slot-scope="scope">0</template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </el-collapse-item>
                            <el-collapse-item name="6">
                                <template slot="title">
                                    <p style="color: #2590eb">06 招标人代表</p>
                                    <el-tooltip
                                        class="item"
                                        effect="dark"
                                        content=""
                                        placement="top-start">
                                        <div slot="content">
                                            ● 根据《中华人民共和国招标投标法》 第三十七条
                                            依法必须进行招标的项目，其评标委员会由招标人的代表和有关技术、经济等方面的专家组成，成员人数为五人以上单数，其中技术、经济等方面的专家不得少于成员总数的三分之二。
                                            <br />
                                            <br />
                                            ● 根据《水利工程建设项目招标投标管理规定》 第四十条
                                            评标工作由评标委员会负责。评标委员会由招标人的代表和有关技术、经济、合同管理等方面的专家组成，成员人数为七人以上单数，其中专家（不含招标人代表人数）不得少于成员总数的三分之二。
                                            <br />
                                            <br />
                                            ● 根据《中华人民共和国招标投标法实施条例》 第十八条
                                            国有资金占控股或者主导地位的依法必须进行招标的项目,招标人应当组建资格审查委员会审查资格预审申请文件。资格审查委员会及其成员应当遵守招标投标法和本条例有关评标委员会及其成员的规定。
                                        </div>
                                        <i
                                            class="el-icon-question"
                                            style="
                                                font-size: 16px;
                                                color: #2590eb;
                                                margin-left: 5px;
                                            "></i>
                                    </el-tooltip>
                                </template>
                                <div style="padding: 10px">
                                    <el-button size="small" plain @click="addPingweiReqProvide"
                                        >新增评委</el-button
                                    >
                                    <el-button
                                        size="small"
                                        plain
                                        @click="postZhaobiaorenpingweiDeleteList"
                                        >删除评委</el-button
                                    >
                                    <el-dialog
                                        class="xuanzexiangmuPop xuanzedanwei"
                                        title="新增招标人评委"
                                        :visible.sync="addPingwei"
                                        @close="addPingweiFrom = {}"
                                        append-to-body>
                                        <div style="height: 100%; padding: 20px">
                                            <el-button
                                                type="primary"
                                                size="small"
                                                @click="
                                                    () => {
                                                        addPingweiReq()
                                                        addPingwei = false
                                                    }
                                                "
                                                >修改保存</el-button
                                            >
                                            <el-collapse
                                                v-model="activeNamesPingwei"
                                                style="
                                                    height: calc(100% - 50px);
                                                    margin-top: 10px;
                                                    overflow-y: auto;
                                                ">
                                                <el-collapse-item name="1">
                                                    <template slot="title">
                                                        <p style="color: #2590eb">
                                                            01 评委基本信息
                                                        </p>
                                                    </template>
                                                    <div style="padding: 10px">
                                                        <el-form
                                                            style="margin-top: 4px"
                                                            label-position="right"
                                                            label-width="165px"
                                                            :model="addPingweiFrom">
                                                            <div
                                                                style="
                                                                    display: flex;
                                                                    justify-content: space-between;
                                                                ">
                                                                <el-form-item
                                                                    label="评委姓名："
                                                                    style="width: 50%">
                                                                    <el-input
                                                                        v-model="
                                                                            addPingweiFrom.name
                                                                        "
                                                                        size="small"></el-input>
                                                                </el-form-item>
                                                                <el-form-item
                                                                    label="性别："
                                                                    style="width: 50%">
                                                                    <el-select
                                                                        v-model="addPingweiFrom.sex"
                                                                        placeholder=""
                                                                        size="small"
                                                                        style="width: 100%">
                                                                        <el-option
                                                                            label="男"
                                                                            value="男">
                                                                        </el-option>
                                                                        <el-option
                                                                            label="女"
                                                                            value="女">
                                                                        </el-option>
                                                                    </el-select>
                                                                </el-form-item>
                                                            </div>
                                                            <div
                                                                style="
                                                                    display: flex;
                                                                    justify-content: space-between;
                                                                ">
                                                                <el-form-item
                                                                    label="年龄："
                                                                    style="width: 50%">
                                                                    <el-input
                                                                        v-model="addPingweiFrom.age"
                                                                        size="small"></el-input>
                                                                </el-form-item>
                                                                <el-form-item
                                                                    label="学历："
                                                                    must
                                                                    style="width: 50%">
                                                                    <el-select
                                                                        v-model="
                                                                            addPingweiFrom.xueli
                                                                        "
                                                                        placeholder=""
                                                                        size="small"
                                                                        style="width: 100%">
                                                                        <el-option
                                                                            label="博士"
                                                                            value="博士">
                                                                        </el-option>
                                                                        <el-option
                                                                            label="硕士"
                                                                            value="硕士">
                                                                        </el-option>
                                                                        <el-option
                                                                            label="本科"
                                                                            value="本科">
                                                                        </el-option>
                                                                        <el-option
                                                                            label="大专"
                                                                            value="大专">
                                                                        </el-option>
                                                                    </el-select>
                                                                </el-form-item>
                                                            </div>
                                                            <div
                                                                style="
                                                                    display: flex;
                                                                    justify-content: space-between;
                                                                ">
                                                                <el-form-item
                                                                    label="身份证号："
                                                                    style="width: 50%"
                                                                    must>
                                                                    <el-input
                                                                        v-model="
                                                                            addPingweiFrom.idCode
                                                                        "
                                                                        size="small"></el-input>
                                                                </el-form-item>
                                                                <el-form-item
                                                                    label="职务："
                                                                    style="width: 50%">
                                                                    <el-input
                                                                        v-model="addPingweiFrom.job"
                                                                        size="small"></el-input>
                                                                </el-form-item>
                                                            </div>
                                                            <div
                                                                style="
                                                                    display: flex;
                                                                    justify-content: space-between;
                                                                ">
                                                                <el-form-item
                                                                    label="评委类型："
                                                                    style="width: 50%"
                                                                    must>
                                                                    <el-select
                                                                        v-model="
                                                                            addPingweiFrom.pw_type
                                                                        "
                                                                        placeholder=""
                                                                        size="small"
                                                                        style="width: 100%">
                                                                        <el-option
                                                                            label="甲方评委"
                                                                            value="甲方评委">
                                                                        </el-option>
                                                                        <el-option
                                                                            label="邀请评委"
                                                                            value="邀请评委">
                                                                        </el-option>
                                                                    </el-select>
                                                                </el-form-item>
                                                                <el-form-item
                                                                    label="评标委员会担任工作："
                                                                    style="width: 50%">
                                                                    <el-select
                                                                        v-model="
                                                                            addPingweiFrom.pw_job
                                                                        "
                                                                        placeholder=""
                                                                        size="small"
                                                                        style="width: 100%">
                                                                        <el-option
                                                                            label="技术标评委"
                                                                            value="技术标评委">
                                                                        </el-option>
                                                                        <el-option
                                                                            label="经济标评委"
                                                                            value="经济标评委">
                                                                        </el-option>
                                                                        <el-option
                                                                            label="经济技术标评委"
                                                                            value="经济技术标评委">
                                                                        </el-option>
                                                                    </el-select>
                                                                </el-form-item>
                                                            </div>
                                                        </el-form>
                                                    </div>
                                                </el-collapse-item>
                                                <el-collapse-item name="2">
                                                    <template slot="title">
                                                        <p style="color: #2590eb">
                                                            02 评委详细信息
                                                        </p>
                                                    </template>
                                                    <el-form
                                                        style="margin-top: 4px"
                                                        label-position="right"
                                                        label-width="165px"
                                                        :model="addPingweiFrom">
                                                        <div
                                                            style="
                                                                display: flex;
                                                                justify-content: space-between;
                                                            ">
                                                            <el-form-item
                                                                label="评委手机："
                                                                style="width: 50%">
                                                                <el-input
                                                                    v-model="addPingweiFrom.phone"
                                                                    size="small"></el-input>
                                                            </el-form-item>
                                                            <el-form-item
                                                                label="职称/执业资格："
                                                                style="width: 50%">
                                                                <el-select
                                                                    v-model="
                                                                        addPingweiFrom.job_name
                                                                    "
                                                                    placeholder=""
                                                                    size="small"
                                                                    style="width: 100%">
                                                                    <el-option
                                                                        label="高级工程师"
                                                                        value="高级工程师">
                                                                    </el-option>
                                                                    <el-option
                                                                        label="工程师"
                                                                        value="工程师">
                                                                    </el-option>
                                                                    <el-option
                                                                        label="助理工程师"
                                                                        value="助理工程师">
                                                                    </el-option>
                                                                    <el-option
                                                                        label="技术员"
                                                                        value="技术员">
                                                                    </el-option>
                                                                </el-select>
                                                            </el-form-item>
                                                        </div>
                                                        <div
                                                            style="
                                                                display: flex;
                                                                justify-content: space-between;
                                                            ">
                                                            <el-form-item
                                                                label="工作单位："
                                                                style="width: 50%">
                                                                <el-input
                                                                    v-model="
                                                                        addPingweiFrom.job_address
                                                                    "
                                                                    size="small"></el-input>
                                                            </el-form-item>
                                                            <el-form-item
                                                                label="单位电话："
                                                                style="width: 50%">
                                                                <el-input
                                                                    v-model="
                                                                        addPingweiFrom.job_phone
                                                                    "
                                                                    size="small"></el-input>
                                                            </el-form-item>
                                                        </div>
                                                        <div
                                                            style="
                                                                display: flex;
                                                                justify-content: space-between;
                                                            ">
                                                            <el-form-item
                                                                label="从事专业："
                                                                style="width: 50%">
                                                                <el-input
                                                                    v-model="
                                                                        addPingweiFrom.zhuan_ye
                                                                    "
                                                                    size="small"></el-input>
                                                            </el-form-item>
                                                            <el-form-item
                                                                label="职称/职业资格证编号："
                                                                style="width: 50%">
                                                                <el-input
                                                                    v-model="
                                                                        addPingweiFrom.zhi_ye_id
                                                                    "
                                                                    size="small"></el-input>
                                                            </el-form-item>
                                                        </div>
                                                    </el-form>
                                                </el-collapse-item>
                                            </el-collapse>
                                        </div>
                                    </el-dialog>
                                    <el-table
                                        :data="pingweiList"
                                        tooltip-effect="dark"
                                        :header-cell-style="{ background: '#FAFAFA' }"
                                        size="small"
                                        style="width: 100%"
                                        @selection-change="sliectDaibiao">
                                        <el-table-column type="selection" width="45">
                                        </el-table-column>
                                        <el-table-column label="序" width="56">
                                            <template slot-scope="scope">{{
                                                scope.$index + 1
                                            }}</template>
                                        </el-table-column>
                                        <el-table-column prop="name" label="姓名">
                                        </el-table-column>
                                        <el-table-column prop="job_address" label="工作单位">
                                        </el-table-column>
                                        <el-table-column prop="job_name" label="职称/执业资格">
                                        </el-table-column>
                                        <el-table-column prop="zhuan_ye" label="从事专业">
                                        </el-table-column>
                                        <el-table-column
                                            prop="pw_job"
                                            label="评标委员会担任工作"
                                            width="160">
                                        </el-table-column>
                                        <el-table-column prop="pw_type" label="评委类型">
                                        </el-table-column>
                                        <el-table-column prop="name" label="查看">
                                            <template slot-scope="scope">
                                                <i
                                                    class="el-icon-search"
                                                    style="color: #2590eb; cursor: pointer"></i>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="name" label="修改">
                                            <template slot-scope="scope">
                                                <i
                                                    class="el-icon-edit"
                                                    style="color: #2590eb; cursor: pointer"></i>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </el-collapse-item>
                        </el-collapse>
                    </div>
                </el-tab-pane>
                <!-- 回避信息 ======================================= -->
                <el-tab-pane label="回避信息" name="3">
                    <div
                        style="
                            border: 1px solid #e4e7ed;
                            border-top: none;
                            border-radius: 0 0 4px 4px;
                            padding: 10px;
                            overflow: auto;
                        ">
                        <el-collapse v-model="activeNames">
                            <el-collapse-item name="7">
                                <template slot="title">
                                    <p style="color: #2590eb">07 回避信息</p>
                                </template>
                                <div style="padding: 10px">
                                    <el-button size="small" plain>设置回避单位</el-button>
                                    <el-button size="small" plain>删除回避单位</el-button>
                                    <el-table
                                        :data="[]"
                                        tooltip-effect="dark"
                                        :header-cell-style="{ background: '#FAFAFA' }"
                                        size="small"
                                        style="width: 100%">
                                        <el-table-column type="selection" width="45">
                                        </el-table-column>
                                        <el-table-column label="序" width="56">
                                            <template slot-scope="scope">{{
                                                scope.$index + 1
                                            }}</template>
                                        </el-table-column>
                                        <el-table-column prop="name" label="回避单位名称">
                                        </el-table-column>
                                    </el-table>
                                    <p>
                                        备注：名单保密起见，招标人、招标代理、交易主体已设置为回避单位，不在这里展示！
                                    </p>
                                    <el-button size="small" plain>设置回避专家</el-button>
                                    <el-button size="small" plain>删除回避专家</el-button>
                                    <el-table
                                        :data="[]"
                                        tooltip-effect="dark"
                                        :header-cell-style="{ background: '#FAFAFA' }"
                                        size="small"
                                        style="width: 100%">
                                        <el-table-column type="selection" width="45">
                                        </el-table-column>
                                        <el-table-column label="序" width="56">
                                            <template slot-scope="scope">{{
                                                scope.$index + 1
                                            }}</template>
                                        </el-table-column>
                                        <el-table-column prop="name" label="回避专家姓名">
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </el-collapse-item>
                        </el-collapse>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </el-dialog>
    </div>
</template>
<script>
import {
    createProjectAdd,
    createProjectList,
    danweiList,
    zhuanyeAdd,
    createProjectUpdate,
    zhuanyeGetlist,
    zhuanyeDelete,
    zhaobiaorenpingweiAdd,
    zhaobiaorenpingweiGetlist,
    zhaobiaorenpingweiDeleteList
} from '@/api/index.js'

export default {
    name: 'management',
    components: {},
    data() {
        return {
            treeData: [
                {
                    label: '国泰新点测试用专业',
                    children: [
                        {
                            label: '项目组人员测试'
                        },
                        {
                            label: '中心工作人员测试'
                        }
                    ]
                },
                {
                    label: '工程类',
                    children: [
                        {
                            label: '规划',
                            children: [{ label: '国民经济和社会发展规划' }]
                        },
                        {
                            label: '投资策划与决策',
                            children: [{ label: '项目建议、可行性研究、评估及后评价' }]
                        }
                    ]
                }
            ],
            activeNames: ['1', '2', '3', '4', '5', '6', '7'],
            // 列表筛选 ======================>
            tableData: [], // 列表
            tableDataTotal: 0,
            tableDataPage: 0,
            tableDataSize: 10,
            inputCode: '', // 搜索代码
            inputName: '', // 搜索名字
            wlistRadio: 0, // 筛选状态
            // 主要内容 ======================>
            dialogFormVisible: false, // 新增弹窗
            activeName: '1', // 必填信息tab切换
            tipsPop: false, // 提示信息
            formLabelAlign: {
                createstates: 0,
                xmid: '',
                xmname: '',
                xm_zbr: '',
                xm_dljg: '',
                xm_pbhs: 1,
                xm_pbdd_id: '',
                xm_pb_time_day: new Date(),
                xm_pb_time_h: '14',
                xm_pb_time_d: '30',
                xm_pb_time: '1998-02-02 22:31:53',
                xm_pwqd_time_day: new Date(),
                xm_pwqd_time_h: '14',
                xm_pwqd_time_d: '30',
                xm_pwqd_time: '1989-01-22 22:07:25',
                day_1: '8',
                day_2: '7',
                xm_dq: '和田地区'
            },
            createstatese1Pop: false, // 意见弹窗
            chulichenggongPop: false, // 处理成功
            // 选择项目 =======================>
            slaketTableData: [], // 选择内容
            xuanzexiangmuPop: false, // 大弹窗
            xuanzexiangmuPopYes: false, // 不可更改
            radiowaicheng: '', // 选择项目选择框
            thisRow: {}, // 内容暂存
            // 选择单位===============
            radio: '',
            zhaobiaorenPop: false, // 选择项目
            zhaobiaorenPopList: [], // 单位列表
            zhaobiaorenIsOne: 1, // 判断是否是招标人
            danweiZancun: '', // 选择单位暂存
            // 设置专业信息============
            zhuanyexinxiPop: false, // 专业信息弹窗
            yixuanzhuanye: [], // 已选专业
            yixuanzhuanyeThis: [], // 当前已选专业
            yixuanzhuanyeDetail: [], // 要删除的列表
            qierenshanchu: false, // 确认专业
            // 新增评委 ================
            pingweiList: [], // 评委列表
            addPingwei: false, // 新增评委弹窗
            addPingweiFrom: {
                sex: '',
                age: '',
                xueli: '',
                idCode: '',
                job: '',
                pw_type: '',
                pw_job: '',
                phone: '',
                job_name: '',
                job_address: '',
                job_phone: '',
                zhuan_ye: '',
                zhi_ye_id: '',
                comname: '',
                comtype: '',
                comaddress: ''
            }, // 新增评委内容
            xuanZhongpingwei: [],
            activeNamesPingwei: ['1', '2']
        }
    },
    mounted() {
        this.getCreateProjectList()
        this.getCreateProjectLLLL()
    },
    methods: {
        async getCreateProjectList() {
            // 获取列表
            const res = await createProjectList({
                page: this.tableDataPage,
                size: this.tableDataSize,
                id: this.inputCode,
                name: this.inputName,
                create_states: this.wlistRadio
            })
            this.tableData = res.data.result.data || []
            this.tableDataTotal = res.data.result.total
        },
        async getCreateProjectLLLL() {
            // 获取列表
            const res = await createProjectList({
                page: 0,
                size: 10000,
                create_states: 0
            })
            this.slaketTableData = res.data.result.data || []
        },
        async addProject(createstatese = 1, tips = true) {
            // 点击新增， tips静默提交
            if (this.formLabelAlign.xmid === '') {
                this.$message.error('标段(包)编号 验证失败：标段(包)编号 必须填写')
                return
            }
            if (this.formLabelAlign.xmname === '') {
                this.$message.error('标段(包)名称 验证失败：标段(包)名称 必须填写')
                return
            }
            if (this.formLabelAlign.xm_pbhs === '') {
                this.$message.error('评标耗时 验证失败：评标耗时 必须填写')
                return
            }
            if (this.formLabelAlign.xm_pbdd_id === '') {
                this.$message.error('评标地点 验证失败：评标地点 必须填写')
                return
            }
            if (this.formLabelAlign.id) {
                // 有id则表示更新
                await createProjectUpdate(this.formLabelAlign)
            } else {
                let timetip =
                    this.formLabelAlign.xm_pb_time_day.setHours(0, 0, 0, 0) +
                    this.formLabelAlign.xm_pb_time_h * 60 * 60 * 1000 +
                    this.formLabelAlign.xm_pb_time_d * 60 * 1000
                let timetip2 =
                    this.formLabelAlign.xm_pwqd_time_day.setHours(0, 0, 0, 0) +
                    this.formLabelAlign.xm_pwqd_time_h * 60 * 60 * 1000 +
                    this.formLabelAlign.xm_pwqd_time_d * 60 * 1000
                this.formLabelAlign.xm_pb_time = this.timeConversion(timetip)
                this.formLabelAlign.xm_pwqd_time = this.timeConversion(timetip2)
                this.formLabelAlign.createstates = createstatese
                const res = await createProjectAdd(this.formLabelAlign)
                this.formLabelAlign.id = res.data.result.id
            }
            if (createstatese == 2) {
                this.createstatese1Pop = true
            }
            if (createstatese == 1 && tips) {
                this.tipsPop = true
            }
        },
        timeConversion(timp) {
            //日期
            let today = new Date(timp)
            var DD = String(today.getDate()).padStart(2, '0') // 获取日
            var MM = String(today.getMonth() + 1).padStart(2, '0') //获取月份，1 月为 0
            var yyyy = today.getFullYear() // 获取年
            // 时间
            var hh = String(today.getHours()).padStart(2, '0') //获取当前小时数(0-23)
            var mm = String(today.getMinutes()).padStart(2, '0') //获取当前分钟数(0-59)
            var ss = String(today.getSeconds()).padStart(2, '0') //获取当前秒数(0-59)
            return yyyy + '-' + MM + '-' + DD + ' ' + hh + ':' + mm + ':' + ss
        },
        selectItem(row) {
            // 大弹窗点击加号添加
            this.formLabelAlign.xmid = row.xmid
            this.formLabelAlign.xmname = row.xmname
            this.formLabelAlign.xm_zbr = row.xm_zbr
            this.formLabelAlign.xm_dljg = row.xm_dljg
            this.formLabelAlign.xm_pbdd_id = row.xm_pbdd_id
            this.xuanzexiangmuPop = false
            this.xuanzexiangmuPopYes = true
        },
        dialogFormVisibleHandleClose() {
            // 关闭新增弹窗
            this.formLabelAlign = {
                createstates: 0,
                xmid: '',
                xmname: '',
                xm_zbr: '',
                xm_dljg: '',
                xm_pbhs: 1,
                xm_pbdd_id: '',
                xm_pb_time_day: new Date(),
                xm_pb_time_h: '14',
                xm_pb_time_d: '30',
                xm_pb_time: '1998-02-02 22:31:53',
                xm_pwqd_time_day: new Date(),
                xm_pwqd_time_h: '14',
                xm_pwqd_time_d: '30',
                xm_pwqd_time: '1989-01-22 22:07:25',
                day_1: '8',
                day_2: '7',
                xm_dq: '和田地区'
            }
            this.xuanzexiangmuPopYes = false
            this.activeName = '1'
            this.getCreateProjectList()
        },
        async zhaobiaorenPopOpen() {
            // 获取单位列表
            const res = await danweiList({
                page: 0,
                size: 1000
            })
            this.zhaobiaorenPopList = res.data.result
        },
        getCurrentRow2(row) {
            // 单位点击确定赋值
            if (this.zhaobiaorenIsOne == 1) {
                this.formLabelAlign.xm_zbr = row.name
            } else {
                this.formLabelAlign.xm_dljg = row.name
            }
        },
        handleCheckChange(res) {
            this.yixuanzhuanyeThis = [
                ...this.yixuanzhuanyeThis,
                { name: res.label, proid: this.formLabelAlign.id }
            ]
        },
        async addDiscipline() {
            // 添加专业前置判断
            if (!this.formLabelAlign.id) {
                await this.addProject(1, false)
            }
            if (this.formLabelAlign.id) {
                this.zhuanyexinxiPop = true
            }
        },
        async isAddDiscipline() {
            // 确认添加专业
            let newArray = [...this.yixuanzhuanye, ...this.yixuanzhuanyeThis]
            for (var i = 0; i < newArray.length - 1; i++) {
                for (var j = i + 1; j < newArray.length; j++) {
                    if (newArray[i].name == newArray[j].name) {
                        newArray.splice(j, 1)
                        j-- // 因为数组长度减小1，所以直接 j++ 会漏掉一个元素，所以要 j--
                    }
                }
            }
            await zhuanyeAdd(newArray)
            this.getZhuanyeList()
        },
        sliectDeleteMajor(item) {
            this.yixuanzhuanyeDetail = item
        },
        async deleteMajor() {
            // 删除专业
            // this.yixuanzhuanye = this.yixuanzhuanyeDetail
            await zhuanyeDelete(this.yixuanzhuanyeDetail)
            this.getZhuanyeList()
        },
        async getZhuanyeList() {
            // 获取专业列表
            if (!this.formLabelAlign.id) return
            const res = await zhuanyeGetlist({ proid: this.formLabelAlign.id })
            this.yixuanzhuanye = res.data.result
        },
        // 评委 ========================
        async pingweiPopOpen() {
            // 获取评委列表
            if (!this.formLabelAlign.id) return
            const res = await zhaobiaorenpingweiGetlist({ proid: this.formLabelAlign.id })
            this.pingweiList = res.data.result
        },
        async addPingweiReqProvide() {
            // 新增评委 前置
            if (!this.formLabelAlign.id) {
                await this.addProject(1, false)
            }
            if (this.formLabelAlign.id) {
                this.addPingwei = true
            }
        },
        async addPingweiReq() {
            // 新增评委
            const res = await zhaobiaorenpingweiAdd({
                proid: this.formLabelAlign.id,
                ...this.addPingweiFrom
            })
            this.pingweiPopOpen()
        },
        sliectDaibiao(item) {
            this.xuanZhongpingwei = item
        },
        async postZhaobiaorenpingweiDeleteList() {
            // 清除专业
            const res = await zhaobiaorenpingweiDeleteList(this.xuanZhongpingwei)
            this.pingweiPopOpen()
        },
        // 分页处理=======================
        handleSizeChange(item) {
            this.tableDataSize = item
            this.getCreateProjectList()
        },
        handleCurrentChange(item) {
            this.tableDataPage = item - 1
            this.getCreateProjectList()
        },
        pickerOptions() {
            console.log('时间选择')
        }
    }
}
</script>
<style lang="scss">
.management {
    height: calc(100vh - 60px);
    .el-radio {
        margin-right: 10px;
    }
    .el-table__header-wrapper {
        background-color: #fafafa !important;
    }
    .input-clone {
        transition: 0.3s !important;
        &:hover {
            color: #2590eb !important;
        }
    }
    .add-object {
        display: flex;
        align-items: center;
        justify-content: center;
        .el-dialog {
            width: 95%;
            height: 95%;
            margin: 0 !important;
            border-radius: 4px;
            .el-dialog__title {
                font-size: 16px;
            }
            .el-dialog__header {
                border-bottom: 1px solid #f0f2f5;
            }
            .el-dialog__body {
                height: calc(100% - 55px);
                padding: 0;
                overflow: hidden;
            }
            .el-tabs__nav {
                border: none;
            }
            .el-tabs {
                .el-tabs__header {
                    margin: 0;
                    .is-active {
                        background: #fff;
                        border: 1px solid #ebebeb;
                        &::before {
                            content: ' ';
                            width: 100%;
                            position: absolute;
                            height: 2px;
                            background: #fff;
                            left: 0;
                            bottom: -2px;
                        }
                    }
                }
                .el-tabs__item {
                    margin-right: 14px;
                    padding: 0 10px;
                    border-left: none;
                    border: none;
                    padding: 0 20px;
                    position: relative;
                    border-radius: 4px 4px 0 0;
                    background: #f5f5f5;
                    border-bottom: 1px solid #ebebeb;
                }
                .el-form-item__label {
                    white-space: nowrap;
                }
                .el-collapse-item__header {
                    border-bottom: 1px solid rgb(37, 144, 235);
                }

                .el-collapse-item__wrap {
                    border: none;
                }
            }

            .el-collapse {
                border: none;
            }
            .input-left-icon {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                right: 35px;
                font-size: 12px;
                color: #5c5c5c;
                cursor: pointer;
            }
            .input-left-icon2 {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                right: 12px;
                font-size: 12px;
                color: #5c5c5c;
                cursor: pointer;
            }
        }
    }
}
.el-collapse-item__header {
    border-bottom: 1px solid rgb(37, 144, 235) !important;
}
.el-collapse-item__wrap {
    border: none !important;
}
.el-tooltip__popper {
    width: 630px;
}
.tipsPop {
    .el-dialog__body {
        padding-top: 0px !important;
    }
}
.xuanzexiangmuPop {
    display: flex;
    align-items: center;
    justify-content: center;
    .el-dialog {
        width: 95%;
        height: 95%;
        margin: 0 !important;
        border-radius: 4px;
        .el-dialog__header {
            border-bottom: 1px solid #f0f2f5;
        }
        .el-dialog__body {
            padding: 0;
            height: 85%;
        }
        .el-radio .el-radio__label {
            display: none;
        }
        .el-pager {
            .number {
                border: 1px solid #d6d6d6;
                background: transparent;
            }
            .number.active {
                background: transparent !important;
                border-color: #2590eb !important;
                color: #2590eb !important;
            }
        }
    }
}
.xuanzedanwei {
    .el-dialog {
        width: 1000px;
        height: 640px;
    }
}
.el-form-item {
    margin-bottom: 8px;
}
.el-form-item[must] {
    .el-form-item__label {
        position: relative;
        &::before {
            content: '*';
            position: absolute;
            top: 55%;
            transform: translateY(-50%);
            right: 2px;
            color: red;
            font-size: 18px;
        }
    }
}
</style>
