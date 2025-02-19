import React, { useState, useEffect, useMemo } from "react";
import "../Cotizacionesjs/Crearcotizacion.css";
//import "./Crearcotizacion.css";
import { Form, Input, Button, Row, Col, Select, Checkbox, Divider, message, DatePicker, Card, Modal } from "antd";
import dayjs from "dayjs";
import { useParams, useNavigate } from "react-router-dom";
import { getAllTipoMoneda } from "../../apis/Moneda";
import { getAllIva } from "../../apis/ivaApi";
import { getAllServicio } from "../../apis/ServiciosApi";
import { createPreCotizacion } from "../../apis/precotizacionApi";
import { createServicioPreCotizacion } from "../../apis/ServiciosPrecotizacionApi";
import { getInfoSistema } from "../../apis/InfoSistemaApi";

const { TextArea } = Input;

const CrearPreCotizaciones = () => {
  const navigate = useNavigate();
  const [servicios, setServicios] = useState([]);
  const { clienteId } = useParams();
  const [fechaSolicitada, setFechaSolicitada] = useState(null);
  const [tiposMonedaData, setTiposMonedaData] = useState([]); // Datos completos de tipos de moneda
  const [tipoMonedaSeleccionada, setTipoMonedaSeleccionada] = useState(null); // Valor seleccionado
  const [ivasData, setIvasData] = useState([]); // Datos completos de IVA
  const [ivaSeleccionado, setIvaSeleccionado] = useState(null); // Valor seleccionado
  const [fechaCaducidad, setFechaCaducidad] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [descuento, setDescuento] = useState(0);
  const [tipoCambioDolar, setTipoCambioDolar] = useState(1);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [correos, setCorreo] = useState("");

  // Obtener el ID de la organización una sola vez
  const organizationId = useMemo(() => parseInt(localStorage.getItem("organizacion_id"), 10), []);


  // Obtener el tipo de cambio del dólar
  useEffect(() => {
    const fetchTipoCambio = async () => {
      try {
        const response = await getInfoSistema();
        const tipoCambio = parseFloat(response.data[0].tipoCambioDolar);
        setTipoCambioDolar(tipoCambio);
      } catch (error) {
        console.error("Error al obtener el tipo de cambio del dólar", error);
      }
    };
    fetchTipoCambio();
  }, []);

  const handleFechaSolicitadaChange = (date) => {
    setFechaSolicitada(date);
    if (date) {
      setFechaCaducidad(dayjs(date).add(1, "month"));
    } else {
      setFechaCaducidad(null);
    }
  };


  useEffect(() => {
    const fetchTipoMoneda = async () => {
      try {
        const response = await getAllTipoMoneda();
        setTiposMonedaData(response.data); // Almacena los datos completos
      } catch (error) {
        console.error('Error al cargar los tipos de moneda', error);
      }
    };
    const fetchIva = async () => {
      try {
        const response = await getAllIva();
        setIvasData(response.data); // Almacena los datos completos
      } catch (error) {
        console.error('Error al cargar los IVA', error);
      }
    };
    const fetchServicios = async () => {
      try {
        const response = await getAllServicio();
        setServicios(response.data);
      } catch (error) {
        console.error("Error al cargar los servicios", error);
      }
    };
    fetchIva();
    fetchTipoMoneda();
    fetchServicios();
  }, [clienteId]);

  const [conceptos, setConceptos] = useState([
    { id: 1, servicio: "", cantidad: 1, precio: 0,precioFinal: 0, descripcion: "" },
  ]);



  const handleAddConcepto = () => {
    setConceptos([...conceptos, { id: conceptos.length + 1, servicio: "", cantidad: 1, precio: 0, descripcion: "" }]);
  };

  const handleRemoveConcepto = (id) => {
    if (conceptos.length > 1) {
      setConceptos(conceptos.filter((concepto) => concepto.id !== id));
    } else {
      message.warning("Debe haber al menos un concepto.");
    }
  };

  const handleInputChange = (id, field, value) => {
    const updatedConceptos = conceptos.map((concepto) =>
      concepto.id === id ? { ...concepto, [field]: value } : concepto
    );
    setConceptos(updatedConceptos);
  };

  const handleServicioChange = (conceptoId, servicioId) => {
    const servicioSeleccionado = servicios.find(servicio => servicio.id === servicioId);
    if (servicioSeleccionado) {
      const updatedConceptos = conceptos.map((concepto) =>
        concepto.id === conceptoId
          ? {
              ...concepto,
              servicio: servicioSeleccionado.id,
              precio: servicioSeleccionado.precio || 0,
              precioFinal: concepto.precioFinal || servicioSeleccionado.precio || 0, 
            }
          : concepto
      );
      setConceptos(updatedConceptos);
    }
  };
  
  // Obtener los servicios que no han sido seleccionados
  const obtenerServiciosDisponibles = (conceptoId) => {
    const serviciosSeleccionados = conceptos
      .filter((c) => c.id !== conceptoId) // Excluye el concepto actual para permitir cambiarlo
      .map((c) => c.servicio); // Obtiene los servicios ya seleccionados
  
    return servicios.filter((servicio) => !serviciosSeleccionados.includes(servicio.id));
  };
  

  const calcularTotales = () => {
    const subtotal = conceptos.reduce((acc, curr) => acc + curr.cantidad * curr.precioFinal, 0);
    const descuentoValor = subtotal * (descuento / 100);
    const subtotalConDescuento = subtotal - descuentoValor;
    const ivaPorcentaje = (ivasData.find(iva => iva.id === ivaSeleccionado)?.porcentaje || 16);
    const iva = subtotalConDescuento * (ivaPorcentaje);
    const total = subtotalConDescuento + iva;

    // Aplicar el tipo de cambio si la moneda es USD (id = 2)
    const esUSD = tipoMonedaSeleccionada === 2;
    const factorConversion = esUSD ? tipoCambioDolar : 1;

    return {
      subtotal: subtotal / factorConversion,
      descuentoValor: descuentoValor / factorConversion,
      subtotalConDescuento: subtotalConDescuento / factorConversion,
      iva: iva / factorConversion,
      total: total / factorConversion,
    };
  };

  const { subtotal, descuentoValor, subtotalConDescuento, iva, total } = calcularTotales();

  const handleSubmit = async () => {
    if (!nombre || !apellido || !empresa || !fechaSolicitada || !tipoMonedaSeleccionada || !ivaSeleccionado) {
      message.error("Por favor, completa todos los campos obligatorios.");
      return;
    }
  
    const dataPrecotizacion = {
      nombreEmpresa: empresa,
      nombreCliente: nombre,
      apellidoCliente: apellido,
      correo: correos,
      denominacion: tiposMonedaData.find((moneda) => moneda.id === tipoMonedaSeleccionada)?.codigo.replace("-", "") || "N/A",
      fechaSolicitud: fechaSolicitada.format("YYYY-MM-DD"),
      fechaCaducidad: fechaCaducidad ? fechaCaducidad.format("YYYY-MM-DD") : null,
      descuento: descuento,
      iva: ivaSeleccionado,
      organizacion:organizationId,
      tipoMoneda: tipoMonedaSeleccionada,
      estado: 8,
    };
  
    try {
      // ✅ 1. Crear la Pre-Cotización y obtener el ID
      const response = await createPreCotizacion(dataPrecotizacion);
  
      if (response.status === 201 || response.status === 200) {
        const preCotizacionId = response.data.id;
  
        console.log("✅ Pre-cotización creada con ID:", preCotizacionId);
  
        // ✅ 2. Insertar los servicios de la Pre-Cotización
        const serviciosPromises = conceptos.map(async (concepto) => {
          if (!concepto.servicio) {
            console.warn(`⚠️ Concepto con ID ${concepto.id} no tiene servicio seleccionado.`);
            return;
          }
  
          const servicioData = {
            descripcion: concepto.descripcion || "Sin descripción",
            precio: Number(concepto.precioFinal) || 0,
            cantidad: Number(concepto.cantidad) || 1,
            preCotizacion: preCotizacionId,
            servicio: concepto.servicio,
          };
  
          console.log("📤 Enviando servicio:", servicioData);
  
          return createServicioPreCotizacion(servicioData)
            .then((res) => {
              console.log(`✅ Servicio ${concepto.servicio} agregado con éxito.`);
            })
            .catch((err) => {
              console.error(`❌ Error al agregar servicio ${concepto.servicio}:`, err.response?.data || err);
              message.error(`Error al agregar servicio ${concepto.servicio}`);
            });
        });
  
        await Promise.all(serviciosPromises);
  
        message.success("Pre-cotización y servicios creados exitosamente.");
        navigate("/precotizacion");
      } else {
        message.error("Hubo un error al crear la pre-cotización.");
      }
    } catch (error) {
      console.error("❌ Error al crear la pre-cotización y servicios:", error);
  
      if (error.response) {
        console.log("Detalles del error:", error.response.data);
        message.error(`Error: ${JSON.stringify(error.response.data)}`);
      } else {
        message.error("Error al enviar los datos. Revisa la consola para más detalles.");
      }
    }
  };
  
  
  

  return (
    <div className="cotizacion-container">
      <h1 className="cotizacion-title">Registro de Pre-Cotización</h1>
      <Form layout="vertical">
        <div className="cotizacion-info-message">
          <strong>Por favor, complete todos los campos requeridos con la información correcta.</strong>
        </div>
     <Row gutter={16}>
          <Col span={12}>
               <Form.Item
                    label="Nombre"
                    name="nombre"
                    rules={[
                    {
                         required: true,
                    },
                    ]}
               >
                    <Input value={nombre}
                    onChange={(e) => setNombre(e.target.value)}/>
               </Form.Item>
          </Col>
          <Col span={12}>
               <Form.Item
                    label="Apellido"
                    name="Apellido"
                    rules={[
                    {
                    required: true,
                    },
                    ]}
               >
                    <Input value={apellido} 
                    onChange={(e) => setApellido(e.target.value)}/>
               </Form.Item>
          </Col>
     </Row>
     <Row gutter={16}>
          <Col span={12}>
               <Form.Item
                    label="Nombre de Empresa"
                    name="empresa"
                    rules={[
                    {
                    required: true,
                    },
                    ]}
               >
                    <Input value={empresa} 
                    onChange={(e) => setEmpresa(e.target.value)}/>
               </Form.Item></Col>
               <Col span={12}>
               <Form.Item
                    label="Correo"
                    name="correo"
                    rules={[
                    {
                    required: true,
                    },
                    ]}
               >
                    <Input value={correos} 
                    onChange={(e) => setCorreo(e.target.value)}/>
               </Form.Item>
          </Col>
     </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Fecha Solicitada" rules={[{ required: true, message: 'Por favor ingresa la fecha.' }]}>
              <DatePicker
                value={fechaSolicitada}
                onChange={handleFechaSolicitadaChange}
                format="DD/MM/YYYY"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Fecha Caducidad" rules={[{ required: true, message: 'Por favor ingresa la fecha.' }]}>
              <DatePicker
                value={fechaCaducidad}
                format="DD/MM/YYYY"
                style={{ width: "100%" }}
                placeholder="Calculada automáticamente"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Tipo de Moneda" rules={[{ required: true, message: 'Por favor selecciona el tipo de moneda.' }]}>
              <Select
                value={tipoMonedaSeleccionada}
                onChange={(value) => setTipoMonedaSeleccionada(value)}
              >
                {tiposMonedaData.map((moneda) => (
                  <Select.Option key={moneda.id} value={moneda.id}>
                    {moneda.codigo} - {moneda.descripcion}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Tasa del IVA actual" rules={[{ required: true, message: 'Por favor selecciona el IVA.' }]}>
              <Select
                value={ivaSeleccionado}
                onChange={(value) => setIvaSeleccionado(value)}
              >
                {ivasData.map((ivas) => (
                  <Select.Option key={ivas.id} value={ivas.id}>
                    {ivas.porcentaje}%
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Descuento (%)" rules={[{ required: true, message: 'Por favor ingresa el descuento.' }]}>
          <Input
            type="number"
            min="0"
            max="100"
            defaultValue={0}
            value={descuento}
            onChange={(e) => setDescuento(parseFloat(e.target.value))}
          />
        </Form.Item>

        <Divider>Agregar Conceptos</Divider>
        {conceptos.map((concepto) => (
          <div key={concepto.id}><Card>
            <h3>Concepto {concepto.id}</h3>
            <Row justify="end">
              <div >
                <Checkbox onChange={() => handleRemoveConcepto(concepto.id)}>
                  Eliminar
                </Checkbox>
              </div>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Servicio" rules={[{ required: true, message: 'Por favor selecciona el servicio.' }]}>
                <Select
                    placeholder="Selecciona un servicio"
                    value={concepto.servicio || undefined}
                    onChange={(value) => handleServicioChange(concepto.id, value)}
                  >
                    {obtenerServiciosDisponibles(concepto.id).map((servicio) => (
                      <Select.Option key={servicio.id} value={servicio.id}>
                        {servicio.nombreServicio}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Cantidad de servicios" rules={[{ required: true, message: 'Por favor ingresa la cantidad.' }]}>
                  <Input
                    type="number"
                    min="1"
                    value={concepto.cantidad}
                    onChange={(e) => handleInputChange(concepto.id, "cantidad", parseInt(e.target.value))}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Precio sugerido" rules={[{ required: true, message: 'Por favor ingresa el precio.' }]}>
                  <Input
                    disabled={true}
                    type="number"
                    min="0"
                    value={concepto.precio}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
              <Form.Item label="Notas" name={['servicios', concepto.id, 'descripcion']}>
                <TextArea
                  value={concepto.descripcion}
                  onChange={(e) => handleInputChange(concepto.id, "descripcion", e.target.value)}
                  placeholder="Notas que aparecerán al final de la cotización (Opcional)"
                />
            </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Precio final" rules={[{ required: true, message: 'Por favor ingresa el precio.' }]}>
                  <Input
                    type="number"
                    min="0"
                    value={concepto.precioFinal}
                    onChange={(e) => handleInputChange(concepto.id, "precioFinal", parseFloat(e.target.value))}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card></div>
        ))}
        <Button type="primary" onClick={handleAddConcepto} style={{ marginBottom: "16px" }}>
          Añadir Concepto
        </Button>

        <div className="cotizacion-totals-buttons">
          <div className="cotizacion-totals">
            <p>Subtotal: {subtotal.toFixed(2)} {tipoMonedaSeleccionada === 2 ? "USD" : "MXN"}</p>
            <p>Descuento ({descuento}%): {descuentoValor.toFixed(2)} {tipoMonedaSeleccionada === 2 ? "USD" : "MXN"}</p>
            <p>Subtotal con descuento: {subtotalConDescuento.toFixed(2)} {tipoMonedaSeleccionada === 2 ? "USD" : "MXN"}</p>
            <p>IVA ({ivasData.find(iva => iva.id === ivaSeleccionado)?.porcentaje || 16}%): {iva.toFixed(2)} {tipoMonedaSeleccionada === 2 ? "USD" : "MXN"}</p>
            <p>Total: {total.toFixed(2)} {tipoMonedaSeleccionada === 2 ? "USD" : "MXN"}</p>
          </div>
          <div className="cotizacion-action-buttons">
            <div className="margin-button"><Button type="default" danger>Cancelar</Button></div>
            <div className="margin-button">
              <Button type="primary" onClick={handleSubmit}>Crear</Button>
            </div>
          </div>
        </div>
      </Form>

      <Modal
        title="Información"
        open={isModalVisible}
        onOk={() => {
          setIsModalVisible(false);
          navigate("/cotizar");
        }}
        onCancel={() => { setIsModalVisible(false); navigate("/cotizar"); }}
        okText="Cerrar"
      >
        <p>¡Se creó exitosamente!</p>
      </Modal>
    </div>
  );
};

export default CrearPreCotizaciones;