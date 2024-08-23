import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, MenuItem, Button, Table, TableBody, TableCell, TableHead, TableRow, Card, CardContent, Box, TableContainer, Paper, Collapse } from '@mui/material';
import { useContext } from 'react';
import { ContestContext } from '../context/ContestProvider';

// Static list of episodes
const EPISODES = [
    { id: '1', name: 'AGARTALA' },
{ id: '2', name: 'AHMEDABAD' },
{ id: '3', name: 'AHMEDGARH' },
{ id: '4', name: 'AIROLI-MUMBAI' },
{ id: '5', name: 'AJMER' },
{ id: '6', name: 'AKOLA' },
{ id: '7', name: 'ALIPURDUAR' },
{ id: '8', name: 'AMALNER' },
{ id: '9', name: 'AMBIKAPUR' },
{ id: '10', name: 'AMET' },
{ id: '11', name: 'AMRAIWADI ODHAV' },
{ id: '12', name: 'ANDHERI-MUMBAI' },
{ id: '13', name: 'ARAKONNAM' },
{ id: '14', name: 'ARARIA' },
{ id: '15', name: 'ASADA' },
{ id: '16', name: 'ASIND' },
{ id: '17', name: 'ASOTRA' },
{ id: '18', name: 'AURANGABAD' },
{ id: '19', name: 'BAITU' },
{ id: '20', name: 'BALANGIR' },
{ id: '21', name: 'BALLARI' },
{ id: '22', name: 'BALOTRA' },
{ id: '23', name: 'BANDRA-MUMBAI' },
{ id: '24', name: 'BANGOMUNDA' },
{ id: '25', name: 'BARDOLI' },
{ id: '26', name: 'BARETA MANDI' },
{ id: '27', name: 'BARMER' },
{ id: '28', name: 'BARPETA ROAD' },
{ id: '29', name: 'BARWALA' },
{ id: '30', name: 'BEAWAR' },
{ id: '31', name: 'BEED' },
{ id: '32', name: 'BEHALA' },
{ id: '33', name: 'BELPADA' },
{ id: '34', name: 'BHADRA' },
{ id: '35', name: 'BHAGALPUR' },
{ id: '36', name: 'BHANDUP-MUMBAI' },
{ id: '37', name: 'BHATTA BAZAR' },
{ id: '38', name: 'BHAWANIPATNA' },
{ id: '39', name: 'BHAYANDAR-MUMBAI' },
{ id: '40', name: 'BHIKHI' },
{ id: '41', name: 'BHILWARA' },
{ id: '42', name: 'BHIM' },
{ id: '43', name: 'BHINASAR' },
{ id: '44', name: 'BHIWANDI-MUMBAI' },
{ id: '45', name: 'BHIWANI' },
{ id: '46', name: 'BHUBNESWAR' },
{ id: '47', name: 'BHUJ-KUTCH' },
{ id: '48', name: 'BHUNA' },
{ id: '49', name: 'BHUSAWAL' },
{ id: '50', name: 'BIDASAR' },
{ id: '51', name: 'BIKANER' },
{ id: '52', name: 'BILASIPARA' },
{ id: '53', name: 'BIRATNAGAR' },
{ id: '54', name: 'BIRGUNJ' },
{ id: '55', name: 'BOISAR-MUMBAI' },
{ id: '56', name: 'BONGAIGAON' },
{ id: '57', name: 'BONGAIGAON SOUTH' },
{ id: '58', name: 'BORAWAR' },
{ id: '59', name: 'BORDA' },
{ id: '60', name: 'BORI' },
{ id: '61', name: 'BORIVALI-MUMBAI' },
{ id: '62', name: 'BURHANPUR' },
{ id: '63', name: 'CBD BELAPUR-MUMBAI' },
{ id: '64', name: 'CHALISGAON' },
{ id: '65', name: 'CHALTHAN' },
{ id: '66', name: 'CHANGRABANDHA' },
{ id: '67', name: 'CHARWAS' },
{ id: '68', name: 'CHAS BOKARO' },
{ id: '69', name: 'CHEMBUR-MUMBAI' },
{ id: '70', name: 'CHENNAI' },
{ id: '71', name: 'CHHAPAR' },
{ id: '72', name: 'CHHOTI KHATU' },
{ id: '73', name: 'CHIKAMANDI' },
{ id: '74', name: 'CHIKHLI' },
{ id: '75', name: 'CHIKMANGLUR' },
{ id: '76', name: 'CHITRADURGA' },
{ id: '77', name: 'CHITTORGARH' },
{ id: '78', name: 'CHURU' },
{ id: '79', name: 'COCHIN' },
{ id: '80', name: 'COIMBATORE' },
{ id: '81', name: 'COOCHBEHAR' },
{ id: '82', name: 'CUTTACK' },
{ id: '83', name: 'DADAR-MUMBAI' },
{ id: '84', name: 'DAHISAR-MUMBAI' },
{ id: '85', name: 'DAKSHIN MUMBAI' },
{ id: '86', name: 'DALKHOLA' },
{ id: '87', name: 'DAULATGARH' },
{ id: '88', name: 'DAVANGERE' },
{ id: '89', name: 'DEESA' },
{ id: '90', name: 'DELHI' },
{ id: '91', name: 'DEOGARH MADARIA' },
{ id: '92', name: 'DESHNOK' },
{ id: '93', name: 'DHARAN' },
{ id: '94', name: 'DHUBRI' },
{ id: '95', name: 'DHULABARI' },
{ id: '96', name: 'DHULE' },
{ id: '97', name: 'DHURI' },
{ id: '98', name: 'DIDWANA' },
{ id: '99', name: 'DINHATA' },
{ id: '100', name: 'DOMBIVALI-MUMBAI' },
{ id: '101', name: 'DONDAICHA' },
{ id: '102', name: 'DUNGRI' },
{ id: '103', name: 'DURG BHILAI' },
{ id: '104', name: 'ERODE' },
{ id: '105', name: 'FALAKATA' },
{ id: '106', name: 'FARIDABAD' },
{ id: '107', name: 'FATEHABAD' },
{ id: '108', name: 'FORBESGANJ' },
{ id: '109', name: 'GADAG' },
{ id: '110', name: 'GANDHIDHAM' },
{ id: '111', name: 'GANDHINAGAR-BANGALORE' },
{ id: '112', name: 'GANGAPUR' },
{ id: '113', name: 'GANGASHAHAR' },
{ id: '114', name: 'GANGAVATI' },
{ id: '115', name: 'GAURIPUR' },
{ id: '116', name: 'GHANSOLI-MUMBAI' },
{ id: '117', name: 'GHATKOPAR-MUMBAI' },
{ id: '118', name: 'GOALPARA' },
{ id: '119', name: 'GOGUNDA' },
{ id: '120', name: 'GOLUWALA' },
{ id: '121', name: 'GOREGAON-MUMBAI' },
{ id: '122', name: 'GOVANDI-MUMBAI' },
{ id: '123', name: 'GUDIYATHAM' },
{ id: '124', name: 'GULABBAGH' },
{ id: '125', name: 'GURUGRAM' },
{ id: '126', name: 'GUWAHATI' },
{ id: '127', name: 'HANSI' },
{ id: '128', name: 'HANUMANGARH TOWN' },
{ id: '129', name: 'HASSAN' },
{ id: '130', name: 'HBST HANUMANTHNAGAR' },
{ id: '131', name: 'HINDMOTOR' },
{ id: '132', name: 'HIRIYUR' },
{ id: '133', name: 'HISAR' },
{ id: '134', name: 'HOSPETE' },
{ id: '135', name: 'HUBLI' },
{ id: '136', name: 'HUNSUR' },
{ id: '137', name: 'HYDERABAD' },
{ id: '138', name: 'ICHALKARANJI' },
{ id: '139', name: 'INDORE' },
{ id: '140', name: 'ISLAMPUR' },
{ id: '141', name: 'JABALPUR' },
{ id: '142', name: 'JAGDALPUR' },
{ id: '143', name: 'JAGRAON' },
{ id: '144', name: 'JAIGAON' },
{ id: '145', name: 'JAIPUR' },
{ id: '146', name: 'JAKHAL MANDI' },
{ id: '147', name: 'JALGAON' },
{ id: '148', name: 'JALNA' },
{ id: '149', name: 'JAMSHEDPUR' },
{ id: '150', name: 'JASOL' },
{ id: '151', name: 'JAWAD' },
{ id: '152', name: 'JAYSINGPUR' },
{ id: '153', name: 'JHABUA' },
{ id: '154', name: 'JHAKNAWADA' },
{ id: '155', name: 'JIND' },
{ id: '156', name: 'JODHPUR' },
{ id: '157', name: 'JOGESHWARI-MUMBAI' },
{ id: '158', name: 'JORAWARPURA' },
{ id: '159', name: 'JORHAT' },
{ id: '160', name: 'JUNA KURLA-MUMBAI' },
{ id: '161', name: 'K. G. F.' },
{ id: '162', name: 'KAITHAL' },
{ id: '163', name: 'KAJUPADA-MUMBAI' },
{ id: '164', name: 'KALANWALI' },
{ id: '165', name: 'KALU' },
{ id: '166', name: 'KAMREJ' },
{ id: '167', name: 'KANCHIPURAM' },
{ id: '168', name: 'KANDIVALI-MUMBAI' },
{ id: '169', name: 'KANJURMARG-MUMBAI' },
{ id: '170', name: 'KANKROLI' },
{ id: '171', name: 'KANOD' },
{ id: '172', name: 'KANPUR' },
{ id: '173', name: 'KANTABANJI' },
{ id: '174', name: 'KARIMGANJ' },
{ id: '175', name: 'KARWAD' },
{ id: '176', name: 'KATHMANDU' },
{ id: '177', name: 'KATIHAR' },
{ id: '178', name: 'KELWA' },
{ id: '179', name: 'KESINGA' },
{ id: '180', name: 'KESUR' },
{ id: '181', name: 'KHAR-MUMBAI' },
{ id: '182', name: 'KHARGHAR-MUMBAI' },
{ id: '183', name: 'KHARUPETHIA' },
{ id: '184', name: 'KHEDA' },
{ id: '185', name: 'KHUSHKIBAGH' },
{ id: '186', name: 'KIM' },
{ id: '187', name: 'KISHANGANJ' },
{ id: '188', name: 'KOKRAJHAR' },
{ id: '189', name: 'KOLKATA MAIN' },
{ id: '190', name: 'KOPARKHAIRANE-MUMBAI' },
{ id: '191', name: 'KOPPAL' },
{ id: '192', name: 'KOPRI THANE-MUMBAI' },
{ id: '193', name: 'KOTA' },
{ id: '194', name: 'KOTKAPURA' },
{ id: '195', name: 'KRISHNAI' },
{ id: '196', name: 'KURLA-MUMBAI' },
{ id: '197', name: 'KURSUD' },
{ id: '198', name: 'LACHHURA' },
{ id: '199', name: 'LADNUN' },
{ id: '200', name: 'LATUR' },
{ id: '201', name: 'LILANWALI' },
{ id: '202', name: 'LILUAH' },
{ id: '203', name: 'LIMBAYAT' },
{ id: '204', name: 'LOKMANYA NAGAR THANE-MUMBAI' },
{ id: '205', name: 'LONAR' },
{ id: '206', name: 'LUDHIANA' },
{ id: '207', name: 'LUNKARANSAR' },
{ id: '208', name: 'MADANGANJ KISHANGARH' },
{ id: '209', name: 'MADURAI' },
{ id: '210', name: 'MALAD-MUMBAI' },
{ id: '211', name: 'MALDA' },
{ id: '212', name: 'MALEGAON' },
{ id: '213', name: 'MANDI ADAMPUR' },
{ id: '214', name: 'MANDI GOBINDGARH' },
{ id: '215', name: 'MANDYA' },
{ id: '216', name: 'MANENDRAGARH' },
{ id: '217', name: 'MANKACHAR' },
{ id: '218', name: 'MANMAD' },
{ id: '219', name: 'MANSA' },
{ id: '220', name: 'MATHABHANGA' },
{ id: '221', name: 'MIRA ROAD-MUMBAI' },
{ id: '222', name: 'MOMASAR' },
{ id: '223', name: 'MULUND-MUMBAI' },
{ id: '224', name: 'MUMBRA-MUMBAI' },
{ id: '225', name: 'MURSHIDABAD' },
{ id: '226', name: 'MYSORE' },
{ id: '227', name: 'NABHA' },
{ id: '228', name: 'NABRANGPUR' },
{ id: '229', name: 'NAGAON' },
{ id: '230', name: 'NAGPUR' },
{ id: '231', name: 'NAL-BIKANER' },
{ id: '232', name: 'NALASOPARA-MUMBAI' },
{ id: '233', name: 'NANJANGUD' },
{ id: '234', name: 'NARWANA' },
{ id: '235', name: 'NATHDWARA' },
{ id: '236', name: 'NAVSARI' },
{ id: '237', name: 'NEEMUCH' },
{ id: '238', name: 'NEHRU NAGAR-MUMBAI' },
{ id: '239', name: 'NEPANAGAR' },
{ id: '240', name: 'NERUL-MUMBAI' },
{ id: '241', name: 'NIRMALI' },
{ id: '242', name: 'NOHAR' },
{ id: '243', name: 'NOIDA' },
{ id: '244', name: 'NOKHA' },
{ id: '245', name: 'PACHPADRA' },
{ id: '246', name: 'PALGHAR-MUMBAI' },
{ id: '247', name: 'PALI' },
{ id: '248', name: 'PANCHKULA' },
{ id: '249', name: 'PANVEL-MUMBAI' },
{ id: '250', name: 'PARVAT PATIYA' },
{ id: '251', name: 'PATNA' },
{ id: '252', name: 'PATNA CITY' },
{ id: '253', name: 'PATNAGARH RAMPUR' },
{ id: '254', name: 'PETLAWAD' },
{ id: '255', name: 'PILIBANGA' },
{ id: '256', name: 'PIMPALNER' },
{ id: '257', name: 'PIMPRI CHINCHWAD' },
{ id: '258', name: 'PUNE' },
{ id: '259', name: 'PUR' },
{ id: '260', name: 'PURVANCHAL - KOLKATA' },
{ id: '261', name: 'RAICHUR' },
{ id: '262', name: 'RAIGANJ' },
{ id: '263', name: 'RAILMAGRA' },
{ id: '264', name: 'RAIPUR' },
{ id: '265', name: 'RAISINGHNAGAR' },
{ id: '266', name: 'RAJAHMUNDRY' },
{ id: '267', name: 'RAJAJI KA KAREDA' },
{ id: '268', name: 'RAJAJINAGAR' },
{ id: '269', name: 'RAJALDESAR' },
{ id: '270', name: 'RAJARAJESHWARI NAGAR' },
{ id: '271', name: 'RAJBIRAJ' },
{ id: '272', name: 'RAJGARH' },
{ id: '273', name: 'RAJNANDGAON' },
{ id: '274', name: 'RAJSAMAND' },
{ id: '275', name: 'RAMAN MANDI' },
{ id: '276', name: 'RANCHI' },
{ id: '277', name: 'RATANGARH' },
{ id: '278', name: 'RATLAM' },
{ id: '279', name: 'RATNAGIRI' },
{ id: '280', name: 'ROHTAK' },
{ id: '281', name: 'ROURKELA' },
{ id: '282', name: 'SACHIN' },
{ id: '283', name: 'SADULPUR' },
{ id: '284', name: 'SAINTHIA' },
{ id: '285', name: 'SAKRI' },
{ id: '286', name: 'SALEM' },
{ id: '287', name: 'SAMANA MANDI' },
{ id: '288', name: 'SANGARIA MANDI' },
{ id: '289', name: 'SANGRUR' },
{ id: '290', name: 'SANTACRUZ-MUMBAI' },
{ id: '291', name: 'SARANGI' },
{ id: '292', name: 'SARDARPURA JODHPUR' },
{ id: '293', name: 'SARDARSHAHAR' },
{ id: '294', name: 'SAWAI MADHOPUR ADARSH NAGAR' },
{ id: '295', name: 'SHAHADA' },
{ id: '296', name: 'SHERPUR' },
{ id: '297', name: 'SHILLONG' },
{ id: '298', name: 'SHIMOGA' },
{ id: '299', name: 'SHIRPUR' },
{ id: '300', name: 'SHISHODA' },
{ id: '301', name: 'SILCHAR' },
{ id: '302', name: 'SILIGURI' },
{ id: '303', name: 'SINDHANUR' },
{ id: '304', name: 'SINDHEKELA' },
{ id: '305', name: 'SION KOLIWADA-MUMBAI' },
{ id: '306', name: 'SIRSA' },
{ id: '307', name: 'SOLAPUR' },
{ id: '308', name: 'SOUTH HOWRAH' },
{ id: '309', name: 'SOUTH KOLKATA' },
{ id: '310', name: 'SRI DUNGARGARH' },
{ id: '311', name: 'SRI GANGANAGAR' },
{ id: '312', name: 'SUJANGARH' },
{ id: '313', name: 'SUNAM' },
{ id: '314', name: 'SUPAUL' },
{ id: '315', name: 'SURAT' },
{ id: '316', name: 'SURATGARH' },
{ id: '317', name: 'T. DASARHALLI' },
{ id: '318', name: 'TAPRA' },
{ id: '319', name: 'TARANAGAR' },
{ id: '320', name: 'TEZPUR' },
{ id: '321', name: 'THANE-MUMBAI' },
{ id: '322', name: 'TIRUPUR' },
{ id: '323', name: 'TIRUVANNAMALAI' },
{ id: '324', name: 'TITILAGARH' },
{ id: '325', name: 'TOHANA' },
{ id: '326', name: 'TOLLYGUNGE' },
{ id: '327', name: 'TOSHAM' },
{ id: '328', name: 'TURBHE-MUMBAI' },
{ id: '329', name: 'TUSRA' },
{ id: '330', name: 'UCHANA MANDI' },
{ id: '331', name: 'UDAIPUR' },
{ id: '332', name: 'UDASAR' },
{ id: '333', name: 'UDHNA' },
{ id: '334', name: 'UJJAIN' },
{ id: '335', name: 'UKLANA MANDI' },
{ id: '336', name: 'URAN' },
{ id: '337', name: 'UTKELA' },
{ id: '338', name: 'UTTAR HOWRAH' },
{ id: '339', name: 'UTTAR KOLKATA' },
{ id: '340', name: 'UTTAR MADHYA KOLKATA' },
{ id: '341', name: 'VADODARA' },
{ id: '342', name: 'VALSAD' },
{ id: '343', name: 'VAPI' },
{ id: '344', name: 'VASAI ROAD-MUMBAI' },
{ id: '345', name: 'VASHI-MUMBAI' },
{ id: '346', name: 'VIJAYNAGAR' },
{ id: '347', name: 'VIJAYWADA' },
{ id: '348', name: 'VIKROLI -MUMBAI' },
{ id: '349', name: 'VIKROLI BUMBKHANA-MUMBAI' },
{ id: '350', name: 'VILE PARLE-MUMBAI' },
{ id: '351', name: 'VILLUPURAM' },
{ id: '352', name: 'VIRAR-MUMBAI' },
{ id: '353', name: 'VISAKHAPATNAM' },
{ id: '354', name: 'VIZIANAGARAM' },
{ id: '355', name: 'VYARA' },
{ id: '356', name: 'WAGLE ESTATE THANE-MUMBAI' },
{ id: '357', name: 'WANI' },
{ id: '358', name: 'YASHWANTPUR' }
    // Add more episodes as needed
  ];

const AdminDashboard = () => {
  const [coordinators, setCoordinators] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [reports, setReports] = useState([]);
  const [newCoordinator, setNewCoordinator] = useState({ name: '', email: '', episode: '' });
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendOtp = async () => {
    try {
      await axios.post('/api/admin/send-otp', { email: email });
      setMessage('OTP sent to your Email Address.');
    } catch (error) {
      setMessage('Failed to send OTP.');
      console.error('Error sending OTP:', error);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await axios.post('/api/admin/verify-otp', { email: email, otp });
      setIsAuthenticated(true);
      setMessage('OTP verified. You are now logged in.');
    } catch (error) {
      setMessage('Invalid OTP. Please try again.');
      console.error('Error verifying OTP:', error);
    }
  };



  useEffect(() => {
    fetchCoordinators();
    fetchEpisodes();
    fetchReports();
  }, []);

  const fetchCoordinators = async () => {
    try {
      const response = await axios.get('/api/admin/coordinators');
      setCoordinators(response.data);
    } catch (error) {
      console.error("Error fetching coordinators:", error);
    }
  };

  const fetchEpisodes = async () => {
    try {
      const response = await axios.get('/api/admin/episodes');
      setEpisodes(response.data);
    } catch (error) {
      console.error("Error fetching episodes:", error);
    }
  };

  const fetchReports = async () => {
    try {
      const response = await axios.get('/api/admin/reports');
      setReports(response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const handleAddCoordinator = async () => {
    try {
      const response = await axios.post('/api/admin/add-coordinator', newCoordinator);
      alert(response.data.message);
      fetchCoordinators();
      setNewCoordinator({ name: '', email: '', episode: '' });
    } catch (error) {
      console.error("Error adding coordinator:", error);
    }
  };

  const handleDeleteCoordinator = async (id) => {
    try {
      const response = await axios.delete(`/api/admin/delete-coordinator/${id}`);
      alert(response.data.message);
      fetchCoordinators();
    } catch (error) {
      console.error("Error deleting coordinator:", error);
    }
  };

  const handleExportReport = async (reportId, format) => {
    try {
      const response = await axios.get(`/api/admin/export-report/${reportId}?format=${format}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report.${format}`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error exporting report:", error);
    }
  };


  const [expandedRow, setExpandedRow] = useState(null);
  const {startContest,setStartContest}=useContext(ContestContext)
  
  const handleRowClick = (reportId) => {
      setExpandedRow(expandedRow === reportId ? null : reportId);
    };

  return (
    <Container>
      {!isAuthenticated ? (
        <Box>
          <Typography variant="h4" gutterBottom>Admin Login</Typography>
          <TextField
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={handleSendOtp}>Send OTP</Button>
          <TextField
            label="OTP"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={handleVerifyOtp}>Verify OTP</Button>
          <Typography variant="body2" color="error">{message}</Typography>
         
        </Box>
      ) : (
      <Box>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>

      {/* Coordinators Management */}
      <Card style={{ marginBottom: '2rem' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Coordinators</Typography>
          <TextField
            select
            label="Episode"
            value={newCoordinator.episode}
            onChange={(e) => setNewCoordinator({ ...newCoordinator, episode: e.target.value })}
            style={{ marginRight: '1rem', width: '20%',}}
          >
            <MenuItem value=""><em>Select Episode</em></MenuItem>
            {EPISODES.map(ep => (
            <MenuItem key={ep.id} value={ep.name}>{ep.name}</MenuItem>
          ))}
          </TextField>
          <TextField
            label="Name"
            value={newCoordinator.name}
            onChange={(e) => setNewCoordinator({ ...newCoordinator, name: e.target.value })}
            style={{ marginRight: '1rem' }}
          />
          <TextField
            label="Email"
            value={newCoordinator.email}
            onChange={(e) => setNewCoordinator({ ...newCoordinator, email: e.target.value })}
            style={{ marginRight: '1rem' }}
          />
          <Button variant="contained" color="primary" onClick={handleAddCoordinator}>
            Add Coordinator
          </Button>
        </CardContent>
      </Card>

      {/* Coordinators Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Episode</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {coordinators.map((coordinator) => (
            <TableRow key={coordinator.id}>
              <TableCell>{coordinator.name}</TableCell>
              <TableCell>{coordinator.email}</TableCell>
              <TableCell>{coordinator.episode}</TableCell>
              <TableCell>
                <Button color="error" onClick={() => handleDeleteCoordinator(coordinator.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Reports Section */}
<Typography variant="h6" gutterBottom style={{ marginTop: '2rem' }}>
  Reports
</Typography>
<TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Episode</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Total Kishores</TableCell>
            <TableCell>Total Categories</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reports.map((report) => (
            <React.Fragment key={report.id}>
              <TableRow onClick={() => handleRowClick(report.id)} style={{ cursor: 'pointer' }}>
                <TableCell>{report.episode}</TableCell>
                <TableCell>{report.date}</TableCell>
                <TableCell>{report.totalKishores}</TableCell>
                <TableCell>{report.totalCategories}</TableCell>
                <TableCell>
                  <Button color="primary" onClick={() => handleExportReport(report.id, 'pdf')}>
                    Export PDF
                  </Button>
                  <Button color="primary" onClick={() => handleExportReport(report.id, 'xlsx')}>
                    Export Excel
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={6} style={{ paddingBottom: 0, paddingTop: 0 }}>
                  <Collapse in={expandedRow === report.id} timeout="auto" unmountOnExit>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>SNo.</TableCell>
                          <TableCell>Participant Name</TableCell>
                          <TableCell>Category</TableCell>
                          <TableCell>Number of Votes</TableCell>
                          <TableCell>Average Score</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {report.participants.map((participant, index) => (
                          <TableRow key={participant.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{participant.name}</TableCell>
                            <TableCell>{participant.category}</TableCell>
                            <TableCell>{participant.votes}</TableCell>
                            <TableCell>{participant.avgScore}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>  
      </Box>
      )}
    </Container>
  );
};

export default AdminDashboard;
