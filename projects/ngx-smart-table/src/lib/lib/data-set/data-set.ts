import {Row} from './row';
import {Column} from './column';

export class DataSet {

  newRow: Row;

  protected data: Array<any> = [];
  protected columns: Array<Column> = [];
  protected rows: Array<Row> = [];
  protected multipleSelectedRows: Set<Row> = new Set();
  protected trackByMultiSelect: string | undefined = undefined;
  protected selectedRow: Row;
  protected expandedRow: Row;
  protected willSelect: string;

  constructor(data: Array<any> = [], protected columnSettings: Object) {
    this.createColumns(columnSettings);
    this.setData(data);
    this.createNewRow();
  }

  setData(data: Array<any>) {
    this.data = data;
    this.createRows();
  }

  getColumns(): Array<Column> {
    return this.columns;
  }

  getExpandedRow(): Row {
    return this.expandedRow;
  }

  getRows(): Array<Row> {
    return this.rows;
  }

  // added
  expandTreeRows(rowId) {
    if (this.rows) {
      this.rows.map(item => {
        if (item.getData().id === rowId) {
          item.hide = !item.hide;
          item.onChange = !item.onChange;
        }
      });
    }
  }

  getTreeRows(settings, filterApplied): Array<Row> {
    if (this.rows) {
      return this.treeTableProcess(this.rows, settings, filterApplied);
    }
  }

  treeTableProcess(data, settings, filterApplied) {
    let filterAppliedFlag = false;

    if (filterApplied.length > 0) {
      const test = filterApplied.filter(item => item.search.length > 0);
      if (test.length > 0) {
        filterAppliedFlag = true;
      }
    }
    const result = [];
    const groupById = data.reduce((group, list) => {
      const {id} = list.data;
      group[id] = group[id] ?? [];
      group[id].push(list);
      return group;
    }, {});

    //check groupByValue exist if don't, group by parent value

    const groupByValueFlag = Object.keys(settings.columns).filter(key => settings.columns[key].groupByValue);
    let valueListForGroup;
    if (groupByValueFlag.length > 0) {
      valueListForGroup = this.getGroupingValue(groupById);
    } else {
      valueListForGroup = this.getNumberOfParents(groupById);
    }

    Object.keys(groupById).map(item => {
      if (valueListForGroup.length < groupById[item].length) {
        groupById[item].isExpandable = true;
      }

      const uniqueValue = [];
      groupById[item].map((value, index) => {
        if (settings.isMergeMultipleCell) {
          Object.keys(value.data.isFirstRowMap).map(row => {
            if (!filterAppliedFlag) {
              if (value.data.isFirstRowMap[row]) {
                value.isFirstRow = true;
                value.cells.map(cell => {
                  if (cell.column.id === row) {
                    cell.column.isMergeColumn = true;
                  }
                });
              }
            } else {
              if (!uniqueValue.includes(value.data[row])) {
                uniqueValue.push(value.data[row]);
                value.isFirstRow = true;
              }
              if (value.data.isFirstRowMap[row]) {
                value.isFirstRow = true;
                value.cells.map(cell => {
                  if (cell.column.id === row) {
                    cell.column.isMergeColumn = true;
                  }
                });
              }
            }
          });
        }

        // config for show Rowspan Botton
        if (groupById[item].isExpandable) {
          value.showRowspanBotton = true;
        }
        // flag for value in first column for id
        if (index === 0) {
           value.showFirstValueInGroup = true;
        }

        if (!value.onChange) {
          value.hide = !value.data.parent;
        } else {
          value.hide = false;
        }
        result.push(value);
      });
    });
    return result;
  }

  getGroupingValue(groupById) {
    let nameForGroupBy;
    const result = [];
    this.columns.map(col => {
      if (col.groupByValue) {
        nameForGroupBy = col.id;
        Object.keys(groupById).map(item => {
          groupById[item].map((value, index) => {
            if (value.data[nameForGroupBy]) {
              result.push(value.data[nameForGroupBy]);
            }
          });
        });
      }
    });
    return [...new Set(result)];
  }

  getNumberOfParents(groupById) {
    const result = [];
    const valueList = [];
    Object.keys(groupById).map(item => {
      groupById[item].map(value => {
        if (value.data.parent) {
          valueList.push(value.data);
        }
      });
    });
    const parentList = [...new Set(valueList)];
    const groupByParent = parentList.reduce((group, list) => {
      const {id} = list;
      group[id] = group[id] ?? [];
      group[id].push(list);
      return group;
    }, {});
    Object.keys(groupByParent).map(key => result.push(groupByParent[key].length));
    const maxNumOfParent = [...new Set(result)][0];
    const finalResult = [];
    for (let i = 0; i < maxNumOfParent; i++) {
      finalResult.push(i);
    }
    return finalResult;
  }

  getMultipleSelectedRows(): Set<Row> {
    return this.multipleSelectedRows;
  }

  getFirstRow(): Row {
    return this.rows[0];
  }

  getLastRow(): Row {
    return this.rows[this.rows.length - 1];
  }

  findRowByData(data: any): Row {
    return this.rows.find((row: Row) => row.getData() === data);
  }

  deselectAll() {
    //this.rows.forEach((row) => { row.isSelected = false;});
    this.getMultipleSelectedRows().clear();
    // we need to clear selectedRow field because no one row selected
    this.selectedRow = undefined;
  }

  clearExpandAll() {
    this.rows.forEach((row) => {
      row.isExpanded = false;
    });
    // we need to clear selectedRow field because no one row selected
    this.expandedRow = undefined;
  }

  selectRow(row: Row): Row | undefined {
    const previousIsSelected = row.isSelected;
    this.deselectAll();

    row.isSelected = !previousIsSelected;
    this.selectedRow = row;

    return this.selectedRow;
  }

  isRowSelected(row: Row): boolean {
    return Array.from(this.getMultipleSelectedRows())
      .find((selectedRow: Row) => selectedRow.getKeyValue() === row.getKeyValue()) !== undefined;
  }

  isSingleRowSelected(row: Row): boolean {
    return row.getKeyValue() === this.selectedRow?.getKeyValue();
  }


  multipleSelectRow(row: Row): Row {
    if (row.isSelected) {
      this.multipleSelectedRows.add(row);
    } else {
      this.multipleSelectedRows.delete(row);
    }
    return row;
  }

  expandRow(row: Row): Row {
    const previousIsExpanded = row.isExpanded;
    this.clearExpandAll();
    if (row.index !== this.expandedRow?.index) {
      this.expandedRow = undefined;
    }
    row.isExpanded = !previousIsExpanded;
    this.expandedRow = row;
    return this.expandedRow;
  }

  selectPreviousRow(): Row {
    if (this.rows.length > 0) {
      let index = this.selectedRow ? this.selectedRow.index : 0;
      if (index > this.rows.length - 1) {
        index = this.rows.length - 1;
      }
      this.selectRow(this.rows[index]);
      return this.selectedRow;
    }
  }

  selectFirstRow(): Row | undefined {
    if (this.rows.length > 0) {
      this.selectRow(this.rows[0]);
      return this.selectedRow;
    }
  }

  selectLastRow(): Row | undefined {
    if (this.rows.length > 0) {
      this.selectRow(this.rows[this.rows.length - 1]);
      return this.selectedRow;
    }
  }

  selectRowByIndex(index: number): Row | undefined {
    const rowsLength: number = this.rows.length;
    if (rowsLength === 0) {
      return;
    }
    if (!index) {
      this.selectFirstRow();
      return this.selectedRow;
    }
    if (index > 0 && index < rowsLength) {
      this.selectRow(this.rows[index]);
      return this.selectedRow;
    }
    // we need to deselect all rows if we got an incorrect index
    this.deselectAll();
  }

  willSelectFirstRow() {
    this.willSelect = 'first';
  }

  willSelectLastRow() {
    this.willSelect = 'last';
  }

  setTrackByMultiSelectByColumn(columnName: string) {
    this.trackByMultiSelect = columnName;
  }

  select(selectedRowIndex?: number): Row | undefined {
    if (this.getRows().length === 0) {
      return;
    }
    if (this.willSelect) {
      if (this.willSelect === 'first') {
        this.selectFirstRow();
      }
      if (this.willSelect === 'last') {
        this.selectLastRow();
      }
      this.willSelect = '';
    } else {
      this.selectRowByIndex(selectedRowIndex);
    }

    return this.selectedRow;
  }

  createNewRow() {
    this.newRow = new Row(-1, {}, this);
    this.newRow.isInEditing = true;
  }

  /**
   * Create columns and order by mapping from the settings
   * @param settings
   * @private
   */
  createColumns(settings: any) {
    for (const id in settings) {
      if (settings.hasOwnProperty(id)) {
        if (!/^\d/.test(id) && id !== 'action' && !settings[id].lastCellPosition) {
          this.columns.push(new Column(id, settings[id], this));
        }
      }
    }
    for (const id in settings) {
      if (settings.hasOwnProperty(id)) {
        if (/^\d/.test(id) || id === 'action' && !settings[id].lastCellPosition) {
          this.columns.push(new Column(id, settings[id], this));
        }
        if (settings[id].lastCellPosition) {
          this.columns.push(new Column(id, settings[id], this));
        }
      }
    }
  }

  /**
   * Create rows based on current data prepared in data source
   * @private
   */
  createRows() {
    this.rows = [];
    this.data.forEach((el, index) => {
      let row: Row = new Row(index, el, this);
      row.setKeyValue(el[this.trackByMultiSelect]);
      this.rows.push(row);
    });
  }
}









