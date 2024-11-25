import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
// TODO: Implementar serviço de dashboard
// import { getDashboardData } from '../../services/dashboardService';

export const Dashboard = () => {
  // TODO: Implementar chamada real à API
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => ({
      totalAttendances: 150,
      pendingAttendances: 45,
      completedAttendances: 95,
      recentAttendances: [
        {
          id: 1,
          customer: 'Cliente Exemplo',
          status: 'pending',
          createdAt: new Date().toISOString(),
        },
        // Mais atendimentos...
      ],
    }),
  });

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'orange',
      'in-progress': 'blue',
      completed: 'green',
      cancelled: 'red',
    };
    return colors[status as keyof typeof colors] || 'gray';
  };

  return (
    <Box>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mb={5}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total de Atendimentos</StatLabel>
              <StatNumber>{dashboardData?.totalAttendances}</StatNumber>
              <StatHelpText>Desde o início</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Atendimentos Pendentes</StatLabel>
              <StatNumber>{dashboardData?.pendingAttendances}</StatNumber>
              <StatHelpText>Aguardando atendimento</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Atendimentos Concluídos</StatLabel>
              <StatNumber>{dashboardData?.completedAttendances}</StatNumber>
              <StatHelpText>Finalizados com sucesso</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      <Card>
        <CardHeader>
          <Heading size="md">Atendimentos Recentes</Heading>
        </CardHeader>
        <CardBody>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Cliente</Th>
                <Th>Status</Th>
                <Th>Data</Th>
              </Tr>
            </Thead>
            <Tbody>
              {dashboardData?.recentAttendances.map((attendance) => (
                <Tr key={attendance.id}>
                  <Td>{attendance.customer}</Td>
                  <Td>
                    <Badge colorScheme={getStatusColor(attendance.status)}>
                      {attendance.status}
                    </Badge>
                  </Td>
                  <Td>{new Date(attendance.createdAt).toLocaleDateString()}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>
    </Box>
  );
};
