// frontend/src/pages/Dashboard.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

// Import the new DocumentItem component
import DocumentItem from '../components/DocumentItem';
import documentService from '../services/documentService';

// Styled components (ONLY these general layout components remain in Dashboard.js)
import styled from 'styled-components';

const DashboardContainer = styled.div`
    padding: 40px 20px;
    max-width: 1200px;
    margin: 20px auto;
    width: 100%;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 30px;
    padding: 20px;
    border: 1px solid var(--jet);
    border-radius: 8px;
    background-color: var(--charcoal);
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
`;

const Label = styled.label`
    margin-bottom: 5px;
    font-weight: bold;
    color: var(--light-gray);
`;

const Input = styled.input`
    padding: 10px;
    border: 1px solid var(--jet);
    border-radius: 5px;
    font-size: 1rem;
    background-color: var(--black);
    color: var(--light-gray);

    &::file-selector-button {
        background-color: var(--jet);
        color: var(--light-gray);
        border: none;
        padding: 8px 12px;
        border-radius: 4px;
        cursor: pointer;
        margin-right: 10px;
    }
`;

const Button = styled.button`
    background-color: var(--blue);
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
`;

const DocumentList = styled.div`
    margin-top: 20px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 25px;
`;

const LoadingState = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
    font-size: 1.2rem;
    color: var(--gray);
    width: 100%;
`;

const PaginationContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-top: 30px;
    padding: 20px;
`;

const PaginationButton = styled.button`
    background-color: ${props => props.active ? 'var(--blue)' : 'var(--jet)'};
    color: white;
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    
    &:disabled {
        background-color: var(--gray);
        cursor: not-allowed;
    }
    
    &:hover:not(:disabled) {
        background-color: ${props => props.active ? '#0077cc' : '#383838'};
    }
`;

const PaginationInfo = styled.span`
    color: var(--gray);
    font-size: 0.9rem;
`;

const SearchContainer = styled.div`
    margin-bottom: 20px;
    display: flex;
    gap: 10px;
    align-items: center;
`;

const SearchInput = styled.input`
    flex: 1;
    padding: 10px;
    border: 1px solid var(--jet);
    border-radius: 5px;
    font-size: 1rem;
    background-color: var(--black);
    color: var(--light-gray);
`;

const SearchButton = styled.button`
    background-color: var(--jet);
    color: var(--light-gray);
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
`;

function Dashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [selectedFile, setSelectedFile] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalDocuments, setTotalDocuments] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredDocuments, setFilteredDocuments] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const fileInputRef = useRef(null);

    const fetchDocuments = useCallback(async (page = 1) => {
        if (!user || !user.token) return;

        setLoading(true);
        setError(null);
        try {
            const response = await documentService.getDocuments(page, 10);
            setDocuments(response.data || []);
            setFilteredDocuments(response.data || []);
            setTotalPages(response.pagination?.pages || 1);
            setTotalDocuments(response.pagination?.total || 0);
            setCurrentPage(page);
        } catch (err) {
            console.error('Failed to fetch documents:', err);
            setError(err.message || 'Failed to load documents.');
            toast.error(err.message || 'Failed to load documents.');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            toast.warn('Please log in to view the dashboard.');
        } else {
            fetchDocuments(1);
        }
    }, [user, navigate, fetchDocuments]);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            toast.error('Please select a file to upload.');
            return;
        }

        if (!user || !user.token) {
            toast.error('You must be logged in to upload files.');
            navigate('/login');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('document', selectedFile);

        try {
            const response = await documentService.uploadDocument(formData);
            toast.success(response.message || 'File uploaded successfully!');
            setSelectedFile(null);
            // Clear the file input field
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            fetchDocuments(1); // Refresh to first page
        } catch (err) {
            console.error('Upload error:', err);
            toast.error(err.message || 'File upload failed!');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (documentId) => {
        if (!window.confirm('Are you sure you want to delete this document?')) {
            return;
        }

        if (!user || !user.token) {
            toast.error('You must be logged in to delete files.');
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            await documentService.deleteDocument(documentId);
            toast.success('Document deleted successfully!');
            fetchDocuments(currentPage);
        } catch (err) {
            console.error('Delete error:', err);
            toast.error(err.message || 'Failed to delete document.');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            fetchDocuments(page);
        }
    };

    // handleSearch function removed - using real-time search instead

    const clearSearch = () => {
        setSearchTerm('');
        setFilteredDocuments(documents);
        setIsSearching(false);
    };

    // Real-time search as user types
    useEffect(() => {
        if (searchTerm.trim()) {
            const filtered = documents.filter(doc => 
                doc.fileName.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredDocuments(filtered);
            setIsSearching(true);
        } else {
            setFilteredDocuments(documents);
            setIsSearching(false);
        }
    }, [searchTerm, documents]);

    // Only show the full-page loader on the initial fetch
    if (loading && documents.length === 0) return <LoadingState>Loading documents...</LoadingState>;
    if (error) return <LoadingState>Error: {error}</LoadingState>;
    if (!user) return null;

    return (
        <DashboardContainer>
            <h1>Welcome, {user.username}!</h1>
            <p>Upload your documents for AI processing.</p>

            <Form onSubmit={handleUpload}>
                <FormGroup>
                    <Label htmlFor="documentFile">Choose Document:</Label>
                    <Input
                        ref={fileInputRef}
                        type="file"
                        id="documentFile"
                        name="document"
                        onChange={handleFileChange}
                        accept=".jpeg,.jpg,.png,.tiff,.bmp,.pdf,.doc,.docx,.txt"
                    />
                    {selectedFile && (
                        <div style={{ marginTop: '5px', fontSize: '0.9em', color: 'var(--light-gray)' }}>
                            Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </div>
                    )}
                </FormGroup>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Uploading...' : 'Upload Document'}
                </Button>
            </Form>

            <h2>Your Uploaded Documents</h2>
            
            <SearchContainer>
                <SearchInput
                    type="text"
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                    <SearchButton onClick={clearSearch}>Clear</SearchButton>
                )}
            </SearchContainer>

            {filteredDocuments.length === 0 ? (
                <p>{isSearching ? 'No documents found matching your search.' : 'No documents uploaded yet.'}</p>
            ) : (
                <>
                    <DocumentList>
                        {filteredDocuments.map((doc) => (
                            <DocumentItem key={doc._id} document={doc} onDelete={handleDelete} />
                        ))}
                    </DocumentList>

                    {totalPages > 1 && (
                        <PaginationContainer>
                            <PaginationButton
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </PaginationButton>
                            
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <PaginationButton
                                    key={page}
                                    active={page === currentPage}
                                    onClick={() => handlePageChange(page)}
                                >
                                    {page}
                                </PaginationButton>
                            ))}
                            
                            <PaginationButton
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </PaginationButton>
                            
                            <PaginationInfo>
                                Page {currentPage} of {totalPages} ({totalDocuments} total documents)
                            </PaginationInfo>
                        </PaginationContainer>
                    )}
                </>
            )}
        </DashboardContainer>
    );
}

export default Dashboard;