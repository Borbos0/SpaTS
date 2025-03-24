import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { loadTableData, createItem, updateItem, deleteItem } from "../store/tableSlice";
import { logout } from "../store/authSlice";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, CircularProgress, Alert, Button, Dialog, DialogActions, DialogContent,
  DialogTitle, TextField
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { TableItem } from "../api/table";

const DataTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector((state: RootState) => state.table);

  const [open, setOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Omit<TableItem, "id">>({
    documentName: "",
    documentStatus: "",
    documentType: "",
    companySignatureName: "",
    companySigDate: "",
    employeeNumber: "",
    employeeSignatureName: "",
    employeeSigDate: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(loadTableData());
  }, [dispatch]);

  const handleOpen = (item?: TableItem) => {
    if (item) {
      setEditMode(true);
      setEditId(item.id);
      setCurrentItem({
        documentName: item.documentName,
        documentStatus: item.documentStatus,
        documentType: item.documentType,
        companySignatureName: item.companySignatureName,
        companySigDate: item.companySigDate,
        employeeNumber: item.employeeNumber,
        employeeSignatureName: item.employeeSignatureName,
        employeeSigDate: item.employeeSigDate,
      });
    } else {
      setEditMode(false);
      setEditId(null);
      setCurrentItem({
        documentName: "",
        documentStatus: "",
        documentType: "",
        companySignatureName: "",
        companySigDate: "",
        employeeNumber: "",
        employeeSignatureName: "",
        employeeSigDate: "",
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    if (editMode && editId) {
      dispatch(updateItem({ id: editId, ...currentItem })).then(() => {
        dispatch(loadTableData());
      });
    } else {
      dispatch(createItem(currentItem)).then(() => {
        dispatch(loadTableData());
      });
    }
    setOpen(false);
  };
  

  const handleDelete = (id: string) => {
    dispatch(deleteItem(id)).then(() => {
        dispatch(loadTableData());
    });
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Добавить запись
        </Button>
        <Button variant="contained" color="primary" onClick={() => dispatch(logout())}>
          Выйти
        </Button>
      </div>

      <TableContainer component={Paper}>
        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Название документа</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Тип</TableCell>
              <TableCell>Компания</TableCell>
              <TableCell>Дата подписания</TableCell>
              <TableCell>Номер сотрудника</TableCell>
              <TableCell>Имя</TableCell>
              <TableCell>Дата подписания</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.documentName}</TableCell>
                <TableCell>{item.documentStatus}</TableCell>
                <TableCell>{item.documentType}</TableCell>
                <TableCell>{item.companySignatureName}</TableCell>
                <TableCell>{dayjs(item.companySigDate).format("YYYY-MM-DD")}</TableCell>
                <TableCell>{item.employeeNumber}</TableCell>
                <TableCell>{item.employeeSignatureName}</TableCell>
                <TableCell>{dayjs(item.employeeSigDate).format("YYYY-MM-DD")}</TableCell>
                <TableCell>
                  <Button color="primary" onClick={() => handleOpen(item)}>
                    Редактировать
                  </Button>
                  <Button color="secondary" onClick={() => handleDelete(item.id)}>
                    Удалить
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{editMode ? "Редактировать запись" : "Добавить запись"}</DialogTitle>
          <DialogContent>
            {Object.keys(currentItem).map((key) => {
              const typedKey = key as keyof typeof currentItem;

              return key.includes("Date") ? (
                <LocalizationProvider key={key} dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label={key}
                    value={currentItem[typedKey] ? dayjs(currentItem[typedKey]) : null}
                    onChange={(date) =>
                      setCurrentItem({
                        ...currentItem,
                        [typedKey]: date ? date.toISOString() : "",
                      })
                    }
                    slotProps={{ textField: { fullWidth: true, margin: "normal", inputProps: { readOnly: true } } }}
                  />
                </LocalizationProvider>
              ) : (
                <TextField
                  key={key}
                  label={key}
                  value={currentItem[typedKey]}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      [typedKey]: e.target.value,
                    })
                  }
                  fullWidth
                  margin="normal"
                />
              );
            })}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Отмена
            </Button>
            <Button onClick={handleSave} color="primary">
              Сохранить
            </Button>
          </DialogActions>
        </Dialog>
      </TableContainer>
    </>
  );
};

export default DataTable;
